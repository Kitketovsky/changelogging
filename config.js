import path from 'path'

export const config = {
  PACKAGE_JSON_PATH: path.join(process.cwd(), 'input.json'),
  UPDATES_TXT_PATH: path.join(process.cwd(), 'updates.txt'),
  OUTPUT_JSON_PATH: path.join(process.cwd(), 'data.json'),
}
