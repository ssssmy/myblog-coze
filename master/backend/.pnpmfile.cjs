// 允许 better-sqlite3 的构建脚本
function readPackage(pkg, context) {
  if (pkg.name === 'better-sqlite3') {
    pkg.scripts = pkg.scripts || {};
    // 确保 install 脚本存在
    if (!pkg.scripts.install) {
      pkg.scripts.install = 'node-gyp rebuild';
    }
  }
  return pkg;
}

module.exports = { readPackage };
