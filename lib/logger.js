// A minimal logger that writes to the console only during development.
// Using a dedicated file lets us disable the `no-console` rule in one place
// while keeping it enforced across the rest of the codebase.

// eslint-disable-next-line no-console
const devLog = (...args) => console.log(...args);
// eslint-disable-next-line no-console
const devError = (...args) => console.error(...args);

export function log(...args) {
	if (process.env.NODE_ENV !== "production") {
		devLog(...args);
	}
}

export function error(...args) {
	if (process.env.NODE_ENV !== "production") {
		devError(...args);
	}
}
