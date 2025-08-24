/**
 * Data class representing sample information.
 */
export class SampleInfo {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}