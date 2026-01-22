# 运行脚本使用说明

本目录包含用于启动和停止博客系统服务的脚本，支持 Windows、Linux 和 macOS。

## 脚本列表

### Linux/macOS

| 脚本 | 说明 |
|------|------|
| `start-all.sh` | 启动所有服务（主项目 + 管理后台） |
| `stop-all.sh` | 停止所有服务 |
| `start-master.sh` | 仅启动主项目（前台 + 后端） |
| `start-admin.sh` | 仅启动管理后台（前台 + 后端） |

### Windows

| 脚本 | 说明 |
|------|------|
| `start-all.bat` | 启动所有服务（主项目 + 管理后台） |
| `stop-all.bat` | 停止所有服务 |
| `start-master.bat` | 仅启动主项目（前台 + 后端） |
| `start-admin.bat` | 仅启动管理后台（前台 + 后端） |

## 使用方法

### Linux/macOS

**1. 启动所有服务**
```bash
bash scripts/start-all.sh
# 或
./scripts/start-all.sh
```

**2. 启动主项目**
```bash
bash scripts/start-master.sh
# 或
./scripts/start-master.sh
```

**3. 启动管理后台**
```bash
bash scripts/start-admin.sh
# 或
./scripts/start-admin.sh
```

**4. 停止所有服务**
```bash
bash scripts/stop-all.sh
# 或
./scripts/stop-all.sh
```

### Windows

**1. 启动所有服务**
双击 `start-all.bat` 或在命令行中运行：
```cmd
scripts\start-all.bat
```

**2. 启动主项目**
双击 `start-master.bat` 或在命令行中运行：
```cmd
scripts\start-master.bat
```

**3. 启动管理后台**
双击 `start-admin.bat` 或在命令行中运行：
```cmd
scripts\start-admin.bat
```

**4. 停止所有服务**
双击 `stop-all.bat` 或在命令行中运行：
```cmd
scripts\stop-all.bat
```

## 服务端口

| 服务 | 端口 | 说明 |
|------|------|------|
| 主项目前端 | 5000 | Vue 3 + Vite 开发服务器 |
| 主项目后端 | 3001 | Express.js API 服务 |
| 管理后台前端 | 5001 | Vue 3 + Element Plus 开发服务器 |
| 管理后台后端 | 3002 | Express.js API 服务 |

## 日志文件

所有服务的日志文件都保存在 `logs/` 目录下：

| 日志文件 | 说明 |
|----------|------|
| `logs/master-backend.log` | 主项目后端日志 |
| `logs/master-frontend.log` | 主项目前端日志 |
| `logs/admin-backend.log` | 管理后台后端日志 |
| `logs/admin-frontend.log` | 管理后台前端日志 |

**查看日志**

- Linux/macOS:
  ```bash
  tail -f logs/master-backend.log
  ```

- Windows:
  ```cmd
  type logs\master-backend.log
  ```

## 功能特性

### 自动化

- 自动检查并安装依赖
- 自动停止已占用的端口服务
- 自动等待服务启动完成
- 显示详细的启动状态和访问地址

### 错误处理

- 如果服务启动失败，会显示错误信息
- 提供日志文件路径方便排查问题
- 进程 PID 保存到日志目录，便于管理和停止

## 常见问题

### 1. 端口被占用

脚本会自动检测并停止占用端口的进程。如果仍然出现问题，请手动检查：

- Linux/macOS:
  ```bash
  lsof -i :5000
  kill -9 <PID>
  ```

- Windows:
  ```cmd
  netstat -ano | findstr :5000
  taskkill /F /PID <PID>
  ```

### 2. 权限问题

如果 Linux/macOS 下脚本无法执行，请添加执行权限：

```bash
chmod +x scripts/*.sh
```

### 3. 依赖安装失败

脚本会自动检测并安装依赖。如果安装失败，请手动执行：

```bash
# 主项目后端
cd master/backend
npm install

# 主项目前端
cd master/frontend
pnpm install

# 管理后台后端
cd admin/backend
npm install

# 管理后台前端
cd admin/frontend
npm install
```

### 4. 服务启动失败

如果服务启动失败，请查看对应的日志文件：

- Linux/macOS:
  ```bash
  tail -f logs/master-backend.log
  ```

- Windows:
  ```cmd
  type logs\master-backend.log
  ```

## 注意事项

1. **首次运行**：首次运行脚本会自动安装所有依赖，可能需要较长时间。
2. **环境要求**：
   - Node.js >= 18.0.0
   - pnpm >= 9.0.0（仅主项目前端需要）
   - npm >= 8.0.0
3. **日志目录**：脚本会自动创建 `logs/` 目录，请勿手动删除。
4. **进程管理**：使用 `stop-all.sh` 或 `stop-all.bat` 停止所有服务，不要直接杀掉进程。

## 自定义配置

如需修改端口或其他配置，请编辑对应的配置文件：

- 主项目前端：`master/frontend/vite.config.ts`
- 主项目后端：`master/backend/server.js`
- 管理后台前端：`admin/frontend/vite.config.ts`
- 管理后台后端：`admin/backend/server.js`

修改后需要更新脚本中的端口号。

## 反馈与支持

如遇问题，请：
1. 查看日志文件
2. 检查端口占用情况
3. 确认环境依赖已正确安装
4. 提交 Issue 到项目仓库

---

**祝使用愉快！**
