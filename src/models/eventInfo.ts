/**
 * Data class representing event information.
 *
 * Attributes:
 *   id   - Unique identifier for the event
 *   name - Name of the event
 */
export class EventInfo {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}