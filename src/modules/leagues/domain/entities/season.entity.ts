export class Season {
  current: boolean;
  year: number;
  start: string;
  end: string;

  constructor(data: Partial<Season>) {
    Object.assign(this, data);
  }

  toJSON() {
    return {
      current: this.current,
      year: this.year,
      start: this.start,
      end: this.end,
    };
  }
}
