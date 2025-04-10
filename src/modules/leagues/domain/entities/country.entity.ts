export class Country {
  readonly code?: string | null;
  readonly flag?: string | null;
  readonly name: string;

  constructor(partial: Partial<Country>) {
    if (!partial.name) {
      throw new Error('Country name is required');
    }

    this.name = partial.name;
    this.code = partial.code ?? null;
    this.flag = partial.flag ?? null;
  }

  toJSON() {
    return {
      code: this.code,
      flag: this.flag,
      name: this.name,
    };
  }
}
