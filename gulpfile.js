/* Gulpfile */

/**
 * Task to split tasks into seperate files
 */
const requireDir = require('require-dir');

/**
 * Require tasks from gulp/tasks folder
 */
requireDir('./gulp/tasks', { recurse: true });