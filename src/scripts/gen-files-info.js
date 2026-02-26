// scripts/gen-files-info.js
const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, basePath = '', result = []) {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const item of items) {
    // 忽略 index.json 文件
    if (item.name === 'index.json' && !item.isDirectory()) {
      continue;
    }
    
    const fullPath = path.join(dirPath, item.name);
    let relativePath = basePath ? `${basePath}/${item.name}` : item.name;
    const stats = fs.statSync(fullPath);
    const mtime = stats.mtime;
    
    result.push({
      name: item.name,
      path: relativePath,
      isDirectory: item.isDirectory(),
      size: item.isDirectory() ? null : stats.size,
      date: `${mtime.getFullYear()}-${String(mtime.getMonth() + 1).padStart(2, '0')}-${String(mtime.getDate()).padStart(2, '0')} ${String(mtime.getHours()).padStart(2, '0')}:${String(mtime.getMinutes()).padStart(2, '0')}`
    });
    
    if (item.isDirectory()) {
      getAllFiles(fullPath, relativePath, result);
    }
  }
  
  return result;
}

function groupByDirectory(files) {
  const result = {};
  
  for (const file of files) {
    let dirPath = path.dirname(file.path);
    if (dirPath === '.') dirPath = '';
    
    // 忽略 index.json 文件
    if (file.name === 'index.json' && !file.isDirectory) {
      continue;
    }
    
    if (!result[dirPath]) {
      result[dirPath] = [];
    }
    
    result[dirPath].push({
      name: file.name,
      isDirectory: file.isDirectory,
      size: file.size,
      date: file.date,
      path: file.path
    });
  }
  
  // 为每个目录排序
  for (const dir in result) {
    result[dir].sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
  }
  
  return result;
}

function createDirectoryJSONs(groupedFiles, baseDir) {
  // 为每个目录创建 JSON 文件
  for (const dirPath in groupedFiles) {
    const outputPath = path.join(baseDir, dirPath, 'index.json');
    const outputDir = path.dirname(outputPath);
    
    // 确保目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 转换格式，移除 path 字段（避免冗余）
    const simplifiedItems = groupedFiles[dirPath]
      .filter(item => item.name !== 'index.json' || item.isDirectory) // 过滤掉 index.json 文件
      .map(item => ({
        name: item.name,
        isDirectory: item.isDirectory,
        size: item.size,
        date: item.date
      }));
    
    // 如果目录为空（只有 index.json），写入空数组
    fs.writeFileSync(outputPath, JSON.stringify(simplifiedItems, null, 2));
    console.log(`📁 生成目录索引: ${dirPath || '/'} (${simplifiedItems.length} 个项目)`);
  }
}

function main() {
  const scanDir = 'public/filesystem';
  const updateRecord = 'public/update';
  
  console.log(`🔍 扫描目录: ${scanDir}`);
  
  if (!fs.existsSync(scanDir)) {
    console.error(`❌ 目录不存在: ${scanDir}`);
    return;
  }
  
  // 清空现有的 index.json 文件
  console.log('🧹 清理现有的 index.json 文件...');
  function cleanIndexFiles(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        cleanIndexFiles(fullPath);
      } else if (item.name === 'index.json') {
        fs.unlinkSync(fullPath);
        console.log(`  🗑️  删除: ${fullPath}`);
      }
    }
  }
  cleanIndexFiles(scanDir);
  
  // 获取所有文件（包含嵌套目录），忽略 index.json
  const allFiles = getAllFiles(scanDir);
  console.log(`📊 总共找到 ${allFiles.length} 个项目（忽略 index.json）`);
  
  // 按目录分组
  const groupedFiles = groupByDirectory(allFiles);
  
  // 为每个目录创建 JSON 文件
  createDirectoryJSONs(groupedFiles, scanDir);
  
  // 写入根目录文件列表（保持兼容性）
  const rootItems = allFiles.filter(item => {
    const parts = item.path.split('/');
    return parts.length === 1;
  }).map(item => ({
    name: item.name,
    isDirectory: item.isDirectory,
    size: item.size,
    date: item.date
  }));
  
  // 写入更新时间
  fs.writeFileSync(updateRecord, new Date().toLocaleString());
  
  // 预览根目录
  console.log('\n📁 根目录内容:');
  rootItems.slice(0, 10).forEach(file => {
    const icon = file.isDirectory ? '📁' : '📄';
    console.log(`  ${icon} ${file.name}`);
  });
  
  if (rootItems.length > 10) {
    console.log(`  ... 还有 ${rootItems.length - 10} 个项目未显示`);
  }
  
  // 统计信息
  console.log('\n📊 统计信息:');
  console.log(`  - 总文件数: ${Object.keys(groupedFiles).reduce((sum, dir) => sum + groupedFiles[dir].length, 0)}`);
  console.log(`  - 目录数: ${Object.keys(groupedFiles).length}`);
  console.log(`  - 根目录项目数: ${rootItems.length}`);
}

if (require.main === module) {
  main();
}