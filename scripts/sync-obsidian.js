#!/usr/bin/env node
/**
 * Obsidian 笔记同步脚本
 * 将 Obsidian 仓库中的笔记同步到博客 docs 目录
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const config = {
  // Obsidian 目录（在项目内的 obsidian 目录）
  obsidianDir: path.resolve(__dirname, '../obsidian'),
  // 博客 docs 目录
  blogDocsDir: path.resolve(__dirname, '../docs'),
  // 同步映射：Obsidian 目录 -> 博客目录
  syncMappings: [
    { src: '笔记', dest: '01.AI提效' },
    // 可以添加更多映射
    // { src: '其他笔记', dest: '02.其他分类' },
  ],
  // 图片目录同步
  attachmentsMapping: {
    src: '附件',
    dest: 'public/attachments',
  },
};

/**
 * 递归复制目录
 */
function copyDir(src, dest, options = {}) {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  源目录不存在: ${src}`);
    return false;
  }

  // 创建目标目录
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // 跳过忽略的目录/文件
    if (options.ignore && options.ignore.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, options);
    } else {
      // 检查是否需要更新（比较修改时间）
      if (fs.existsSync(destPath)) {
        const srcStat = fs.statSync(srcPath);
        const destStat = fs.statSync(destPath);
        if (srcStat.mtime <= destStat.mtime) {
          continue; // 文件未修改，跳过
        }
      }
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ 复制: ${entry.name}`);
    }
  }

  return true;
}

/**
 * 清理目标目录中不存在于源目录的文件
 */
function cleanDestDir(src, dest, options = {}) {
  if (!fs.existsSync(dest)) return;

  const entries = fs.readdirSync(dest, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (options.ignore && options.ignore.includes(entry.name)) {
      continue;
    }

    if (!fs.existsSync(srcPath)) {
      if (entry.isDirectory()) {
        fs.rmSync(destPath, { recursive: true });
        console.log(`🗑️  删除目录: ${entry.name}`);
      } else {
        fs.unlinkSync(destPath);
        console.log(`🗑️  删除文件: ${entry.name}`);
      }
    } else if (entry.isDirectory()) {
      cleanDestDir(srcPath, destPath, options);
    }
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🔄 开始同步 Obsidian 笔记...\n');

  // 同步笔记目录
  for (const mapping of config.syncMappings) {
    const srcPath = path.join(config.obsidianDir, mapping.src);
    const destPath = path.join(config.blogDocsDir, mapping.dest);

    console.log(`📁 同步: ${mapping.src} -> ${mapping.dest}`);

    if (copyDir(srcPath, destPath, { ignore: ['.obsidian'] })) {
      cleanDestDir(srcPath, destPath, { ignore: ['.obsidian'] });
    }
  }

  // 同步附件目录
  if (config.attachmentsMapping) {
    const srcPath = path.join(config.obsidianDir, config.attachmentsMapping.src);
    const destPath = path.join(config.blogDocsDir, config.attachmentsMapping.dest);

    console.log(`\n📦 同步附件: ${config.attachmentsMapping.src} -> ${config.attachmentsMapping.dest}`);

    if (fs.existsSync(srcPath)) {
      copyDir(srcPath, destPath);
    } else {
      console.log(`⚠️  附件目录不存在: ${srcPath}`);
    }
  }

  console.log('\n✨ 同步完成！');
}

// 执行
main();
