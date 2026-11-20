import type { PatternState } from '../types';

export class PatternHistory {
  private past: PatternState[] = [];
  private present: PatternState;
  private future: PatternState[] = [];
  private maxDepth = 30;

  constructor(initialState: PatternState) {
    this.present = JSON.parse(JSON.stringify(initialState));
  }

  public get current(): PatternState {
    return this.present;
  }

  public get canUndo(): boolean {
    return this.past.length > 0;
  }

  public get canRedo(): boolean {
    return this.future.length > 0;
  }

  public push(newState: PatternState): void {
    const serialized = JSON.stringify(newState);
    if (serialized === JSON.stringify(this.present)) {
      return; // No-op if identical
    }

    this.past.push(this.present);
    if (this.past.length > this.maxDepth) {
      this.past.shift();
    }
    this.present = JSON.parse(serialized);
    this.future = []; // Clear redo stack on new action
  }

  public undo(): PatternState | null {
    if (!this.canUndo) return null;
    const previous = this.past.pop()!;
    this.future.unshift(this.present);
    this.present = previous;
    return JSON.parse(JSON.stringify(this.present));
  }

  public redo(): PatternState | null {
    if (!this.canRedo) return null;
    const next = this.future.shift()!;
    this.past.push(this.present);
    this.present = next;
    return JSON.parse(JSON.stringify(this.present));
  }
}
