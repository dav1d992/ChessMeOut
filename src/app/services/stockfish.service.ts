import { Injectable, signal, computed } from '@angular/core';
import { AnalysisResult, Evaluation } from '../models/chess.models';

@Injectable({ providedIn: 'root' })
export class StockfishService {
  private worker: Worker | null = null;
  private resolveAnalysis: ((result: AnalysisResult) => void) | null = null;
  private currentPv: string[] = [];
  private currentDepth = 0;
  private currentScore: Evaluation | null = null;
  private targetDepth = 18;
  private sideToMoveFlip = 1; // 1 if white to move, -1 if black to move
  private analysisQueue: (() => void)[] = [];
  private isBusy = false;

  readonly isReady = signal(false);
  readonly isAnalyzing = signal(false);
  readonly liveEval = signal<Evaluation | null>(null);
  readonly liveDepth = signal(0);

  constructor() {
    this.initEngine();
  }

  private initEngine(): void {
    try {
      this.worker = new Worker('/stockfish/stockfish.js');
      this.worker.onmessage = (event: MessageEvent) => this.handleMessage(event.data);
      this.worker.onerror = (err) => console.error('Stockfish error:', err);
      this.sendCommand('uci');
    } catch (e) {
      console.error('Failed to load Stockfish:', e);
    }
  }

  private sendCommand(cmd: string): void {
    this.worker?.postMessage(cmd);
  }

  private handleMessage(line: string): void {
    if (line === 'uciok') {
      this.sendCommand('isready');
    } else if (line === 'readyok') {
      this.isReady.set(true);
    } else if (line.startsWith('info depth')) {
      this.parseInfo(line);
    } else if (line.startsWith('bestmove')) {
      this.handleBestMove(line);
    }
  }

  private parseInfo(line: string): void {
    const depthMatch = line.match(/depth (\d+)/);
    const scoreMatch = line.match(/score (cp|mate) (-?\d+)/);
    const pvMatch = line.match(/ pv (.+)/);

    if (depthMatch) {
      this.currentDepth = parseInt(depthMatch[1], 10);
      this.liveDepth.set(this.currentDepth);
    }

    if (scoreMatch) {
      // Normalize to white's perspective: Stockfish reports from side-to-move's POV
      const rawValue = parseInt(scoreMatch[2], 10);
      this.currentScore = {
        type: scoreMatch[1] as 'cp' | 'mate',
        value: rawValue * this.sideToMoveFlip,
        depth: this.currentDepth,
      };
      this.liveEval.set({ ...this.currentScore });
    }

    if (pvMatch) {
      this.currentPv = pvMatch[1].split(' ');
    }
  }

  private handleBestMove(line: string): void {
    const bestMoveMatch = line.match(/bestmove (\S+)/);
    if (bestMoveMatch && this.resolveAnalysis && this.currentScore) {
      const result: AnalysisResult = {
        fen: '',
        evaluation: { ...this.currentScore, bestMove: bestMoveMatch[1], pv: [...this.currentPv] },
        bestMove: bestMoveMatch[1],
        pv: [...this.currentPv],
      };
      this.isAnalyzing.set(false);
      const resolve = this.resolveAnalysis;
      this.resolveAnalysis = null;
      this.isBusy = false;
      resolve(result);
      this.processQueue();
    }
  }

  private processQueue(): void {
    if (this.isBusy || this.analysisQueue.length === 0) return;
    const next = this.analysisQueue.shift()!;
    next();
  }

  analyze(fen: string, depth: number = 18): Promise<AnalysisResult> {
    return new Promise((resolve) => {
      const run = () => {
        this.isBusy = true;
        this.resolveAnalysis = (result) => {
          result.fen = fen;
          resolve(result);
        };
        this.targetDepth = depth;
        this.currentPv = [];
        this.currentDepth = 0;
        this.currentScore = null;
        // Determine flip factor: normalize all evals to white's perspective
        const sideToMove = fen.split(' ')[1];
        this.sideToMoveFlip = sideToMove === 'b' ? -1 : 1;
        this.isAnalyzing.set(true);
        this.sendCommand('position fen ' + fen);
        this.sendCommand('go depth ' + depth);
      };

      if (this.isBusy) {
        this.analysisQueue.push(run);
      } else {
        run();
      }
    });
  }

  stopAnalysis(): void {
    this.sendCommand('stop');
    this.isAnalyzing.set(false);
  }

  setOption(name: string, value: string | number): void {
    this.sendCommand(`setoption name ${name} value ${value}`);
  }

  destroy(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}
