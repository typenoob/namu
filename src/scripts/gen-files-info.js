// scripts/gen-files-info.js
const fs = require('fs');
const path = require('path');

function main() {
  const scanDir = 'public/filesystem';
  const outputFile = 'public/filesinfo.json';
  const updateRecord = 'public/update';
  
  console.log(`🔍 扫描目录: ${scanDir}`);
  
  if (!fs.existsSync(scanDir)) {
    console.error(`❌ 目录不存在: ${scanDir}`);
    return;
  }
  
  const items = fs.readdirSync(scanDir, { withFileTypes: true });
  const files = [];
  
  // 目录在前，文件在后，按名称排序
  const sortedItems = items.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });
  
  for (const item of sortedItems) {
    const itemPath = path.join(scanDir, item.name);
    const stats = fs.statSync(itemPath);
    const mtime = stats.mtime;
    
    files.push({
      name: item.name + (item.isDirectory() ? '/' : ''),
      size: item.isDirectory() ? null : stats.size,
      date: `${mtime.getFullYear()}-${String(mtime.getMonth() + 1).padStart(2, '0')}-${String(mtime.getDate()).padStart(2, '0')} ${String(mtime.getHours()).padStart(2, '0')}:${String(mtime.getMinutes()).padStart(2, '0')}`,
      isDirectory: item.isDirectory()
    });
  }
  
  console.log(`✅ 找到 ${files.length} 个项目`);
  
  // 确保输出目录存在
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 写入简化的 JSON
  fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));
  // 写入更新时间
  fs.writeFileSync(updateRecord, new Date().toLocaleString());
  console.log(`📁 文件列表已保存到: ${outputFile}`);
  
  // 预览
  console.log('\n📁 生成的文件列表:');
  files.slice(0, 10).forEach(file => {
    const icon = file.isDirectory ? '📁' : '📄';
    console.log(`  ${icon} ${file.name}`);
  });
  
  if (files.length > 10) {
    console.log(`  ... 还有 ${files.length - 10} 个项目未显示`);
  }
}

if (require.main === module) {
  main();
}