import fs from 'fs';
import path from 'path';

function getExactFileName(dir, file) {
  try {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      if (f.toLowerCase() === file.toLowerCase()) {
        return f;
      }
    }
  } catch(e) {}
  return null;
}

const walk = dir => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules')) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
};

const backendDir = path.join(process.cwd(), 'backend');
const files = walk(backendDir);
const importRegex = /from\s+['"]([^'"]+)['"]/g;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Skip node_modules imports
    if (!importPath.startsWith('.') && !importPath.startsWith('/')) continue;
    
    const dirName = path.dirname(path.resolve(path.dirname(file), importPath));
    const baseName = path.basename(importPath);
    
    const exactMatch = getExactFileName(dirName, baseName);
    
    if (exactMatch && exactMatch !== baseName) {
      console.log(`ERROR: Case mismatch in ${file}`);
      console.log(`  Imported as: ${baseName}`);
      console.log(`  Actual file: ${exactMatch}`);
    } else if (!exactMatch) {
       // It could be a directory import or a missing file
       console.log(`WARNING: Cannot find ${baseName} imported in ${file}`);
    }
  }
});
