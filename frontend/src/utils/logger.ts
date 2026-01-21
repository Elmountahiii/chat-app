/**
 * Centralized logging utility
 * Only logs in development mode to keep production clean and performant
 */

const isDev = process.env.NODE_ENV === "development";

/**
 * Logger that only outputs in development environment
 * Preserves all console formatting including colors and emojis
 */
export const logger = {
	/**
	 * Log general information (only in development)
	 */
	log: (...args: unknown[]) => {
		if (isDev) {
			console.log(...args);
		}
	},

	/**
	 * Log errors (only in development)
	 * Note: In production, you might want to send these to a monitoring service
	 */
	error: (...args: unknown[]) => {
		if (isDev) {
			console.error(...args);
		}
	},

	/**
	 * Log warnings (only in development)
	 */
	warn: (...args: unknown[]) => {
		if (isDev) {
			console.warn(...args);
		}
	},

	/**
	 * Log informational messages (only in development)
	 */
	info: (...args: unknown[]) => {
		if (isDev) {
			console.info(...args);
		}
	},

	/**
	 * Log debug information (only in development)
	 */
	debug: (...args: unknown[]) => {
		if (isDev) {
			console.debug(...args);
		}
	},
};
