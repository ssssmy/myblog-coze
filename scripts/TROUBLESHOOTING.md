# 启动脚本使用说明

## Windows 用户

### 问题诊断

如果启动脚本提示端口被占用，请按以下步骤操作：

1. **首先运行停止脚本**
   ```cmd
   scripts\stop-all.bat
   ```

2. **检查端口是否已释放**
   - 打开命令提示符（管理员权限）
   - 输入以下命令检查端口：
     ```cmd
     netstat -ano | findstr ":3001 "
     netstat -ano | findstr ":3002 "
     netstat -ano | findstr ":5000 "
     netstat -ano | findstr ":5001 "
     ```
   - 如果没有任何输出，说明端口已释放

3. **手动清理残留进程（如果需要）**
   - 如果端口仍被占用，使用以下命令查找并杀死进程：
     ```cmd
     for /f "tokens=5" %a in ('netstat -ano ^| findstr ":3001 "') do taskkill /F /PID %a
     for /f "tokens=5" %a in ('netstat -ano ^| findstr ":3002 "') do taskkill /F /PID %a
     for /f "tokens=5" %a in ('netstat -ano ^| findstr ":5000 "') do taskkill /F /PID %a
     for /f "tokens=5" %a in ('netstat -ano ^| findstr ":5001 "') do taskkill /F /PID %a
     ```

4. **重新启动服务**
   ```cmd
   scripts\start-all.bat
   ```

### 常见问题

#### 问题 1: 端口被其他程序占用

**症状**: 即使运行了停止脚本，端口仍被占用

**解决方案**:
1. 查看占用端口的进程：
   ```cmd
   netstat -ano | findstr ":3001 "
   ```
2. 记下最后一列的 PID
3. 查看该进程是什么：
   ```cmd
   tasklist | findstr "PID"
   ```
4. 如果是系统或其他重要进程，请考虑更改项目端口

#### 问题 2: 服务启动失败

**症状**: 脚本提示启动失败

**解决方案**:
1. 查看日志文件：
   ```cmd
   type logs\master-backend.log
   type logs\master-frontend.log
   type logs\admin-backend.log
   type logs\admin-frontend.log
   ```
2. 检查是否缺少依赖：
   - 确保已安装 Node.js
   - 确保已安装 pnpm（主项目前端需要）
3. 重新安装依赖：
   ```cmd
   cd master\backend
   npm install
   cd ..\frontend
   pnpm install
   cd ..\..\admin\backend
   npm install
   cd ..\frontend
   npm install
   ```

#### 问题 3: 启动后无法访问

**症状**: 服务启动成功但无法访问

**解决方案**:
1. 检查防火墙设置
2. 确认浏览器访问的地址正确：
   - 主项目: http://localhost:5000
   - 管理后台: http://localhost:5001
3. 使用 curl 测试：
   ```cmd
   curl http://localhost:5000
   curl http://localhost:3001/api/posts
   ```

## Linux/macOS 用户

### 问题诊断

1. **运行停止脚本**
   ```bash
   bash scripts/stop-all.sh
   ```

2. **检查端口是否已释放**
   ```bash
   ss -tuln | grep -E ':3001[[:space:]]|:3002[[:space:]]|:5000[[:space:]]|:5001[[:space:]]'
   ```

3. **手动清理残留进程**
   ```bash
   for port in 3001 3002 5000 5001; do
     pid=$(ss -lptn "sport = :${port}" 2>/dev/null | grep -o 'pid=[0-9]*' | cut -d= -f2)
     if [ -n "$pid" ]; then
       kill -9 $pid
     fi
   done
   ```

4. **重新启动服务**
   ```bash
   bash scripts/start-all.sh
   ```

### 常见问题

#### 问题 1: 权限不足

**解决方案**:
```bash
chmod +x scripts/*.sh
```

#### 问题 2: 端口被占用

**解决方案**:
```bash
# 查找占用端口的进程
ss -lptn 'sport = :5000'

# 杀死进程
kill -9 <PID>
```

#### 问题 3: 服务启动失败

**解决方案**:
查看日志文件：
```bash
tail -f logs/master-backend.log
tail -f logs/master-frontend.log
tail -f logs/admin-backend.log
tail -f logs/admin-frontend.log
```

## 日志查看

### Windows
```cmd
# 查看主项目后端日志
type logs\master-backend.log

# 实时查看日志（需要工具）
# 或使用 PowerShell
Get-Content logs\master-backend.log -Wait
```

### Linux/macOS
```bash
# 查看日志
tail -f logs/master-backend.log
tail -f logs/master-frontend.log
tail -f logs/admin-backend.log
tail -f logs/admin-frontend.log
```

## 端口说明

| 端口 | 服务 | 说明 |
|------|------|------|
| 3001 | 主项目后端 | Express.js API 服务器 |
| 3002 | 管理后台后端 | Express.js API 服务器 |
| 5000 | 主项目前端 | Vite 开发服务器 |
| 5001 | 管理后台前端 | Vite 开发服务器 |

## 联系支持

如果问题仍未解决，请提供以下信息：
1. 操作系统版本
2. 错误信息截图
3. 日志文件内容
4. 已尝试的解决方案
