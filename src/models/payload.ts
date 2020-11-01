export class Payload {
	constructor(public data: Buffer) {}

	toString() {
		return `Payload ==========================
${this.data.toString()}`;
	}
}