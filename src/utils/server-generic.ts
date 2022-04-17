import path from 'path';
import * as fs from 'fs';

/**
 * Please note that these functions are ONLY executed on server side (at compilation time since app is statically built)
 * DO NOT mix them up with other shared functions to front (this would break app compilation)
 */

export function getDataFileSync(filepath: string): string
{
  const dataDirectory = path.join(process.cwd(), 'data');

  return fs.readFileSync(`${dataDirectory}/${filepath}`, 'utf8');
}