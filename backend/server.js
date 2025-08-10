const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// データファイルのパス
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');

// 初期データ
const initialUsers = [
    {
      "userID": "U001",
      "userName": "田中さん",
      "isInRoom": false,
      "lastUpdate": "2025-08-10T07:05:33.719Z"
    },
    {
      "userID": "U002",
      "userName": "佐藤さん",
      "isInRoom": true,
      "lastUpdate": "2025-08-10T04:12:29.484Z"
    },
    {
      "userID": "U003",
      "userName": "山田さん",
      "isInRoom": false,
      "lastUpdate": "2025-08-10T04:12:29.484Z"
    },
    {
      "userID": "U004",
      "userName": "鈴木さん",
      "isInRoom": true,
      "lastUpdate": "2025-08-10T04:14:51.065Z"
    },
    {
      "userID": "U005",
      "userName": "高橋さん",
      "isInRoom": false,
      "lastUpdate": "2025-08-10T07:12:54.938Z"
    },
    {
      "userID": "U006",
      "userName": "伊藤さん",
      "isInRoom": true,
      "lastUpdate": "2025-08-10T07:12:57.440Z"
    },
    {
      "userID": "U007",
      "userName": "渡辺さん",
      "isInRoom": true,
      "lastUpdate": "2025-08-10T07:13:02.142Z"
    },
    {
      "userID": "U008",
      "userName": "加藤さん",
      "isInRoom": false,
      "lastUpdate": "2025-08-10T05:29:25.823Z"
    },
    {
      "userID": "U009",
      "userName": "木村さん",
      "isInRoom": false,
      "lastUpdate": "2025-08-10T05:29:18.021Z"
    }
  ];

const initialLogs = [
    {
      "userID": "U002",
      "userName": "佐藤さん",
      "action": "enter",
      "timestamp": "2025-08-10T05:30:00.000Z",
      "comment": "研究のため"
    },
    {
      "userID": "U005",
      "userName": "高橋さん",
      "action": "exit",
      "timestamp": "2025-08-10T05:15:00.000Z",
      "comment": "作業完了"
    },
    {
      "userID": "U004",
      "userName": "鈴木さん",
      "action": "enter",
      "timestamp": "2025-08-10T04:45:00.000Z",
      "comment": "退出"
    },
    {
      "userID": "U007",
      "userName": "渡辺さん",
      "action": "enter",
      "timestamp": "2025-08-10T04:20:00.000Z",
      "comment": "研究のため"
    },
    {
      "userID": "U009",
      "userName": "木村さん",
      "action": "exit",
      "timestamp": "2025-08-10T03:50:00.000Z",
      "comment": "退出"
    }
  ];

// データファイルの初期化
async function initializeDataFiles() {
  try {
    // データディレクトリが存在しない場合は作成
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // ユーザーファイルの初期化
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify(initialUsers, null, 2));
      console.log('ユーザーファイルを初期化しました');
    }
    
    // ログファイルの初期化
    try {
      await fs.access(LOGS_FILE);
    } catch {
      await fs.writeFile(LOGS_FILE, JSON.stringify(initialLogs, null, 2));
      console.log('ログファイルを初期化しました');
    }
  } catch (error) {
    console.error('データファイルの初期化に失敗:', error);
  }
}

// ファイルからデータを読み込み
async function readDataFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`ファイル読み込みエラー (${filePath}):`, error);
    return [];
  }
}

// ファイルにデータを書き込み
async function writeDataFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`ファイル書き込みエラー (${filePath}):`, error);
    return false;
  }
}

// API エンドポイント

// 全ユーザー取得
app.get('/api/users', async (req, res) => {
  try {
    const users = await readDataFile(USERS_FILE);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'ユーザー情報の取得に失敗しました' });
  }
});

// 全ログ取得
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await readDataFile(LOGS_FILE);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'ログ情報の取得に失敗しました' });
  }
});

// 特定ユーザーの状態取得
app.get('/api/users/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    const users = await readDataFile(USERS_FILE);
    const user = users.find(u => u.userID === userID);
    
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'ユーザー情報の取得に失敗しました' });
  }
});

// 入室記録
app.post('/api/users/:userID/enter', async (req, res) => {
  try {
    const { userID } = req.params;
    const { userName, comment } = req.body;
    
    const users = await readDataFile(USERS_FILE);
    const user = users.find(u => u.userID === userID);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'ユーザーが見つかりません' 
      });
    } else if (userName) {
      // 既存ユーザーの名前を更新
      user.userName = userName;
    }
    
    // 既に入室中の場合はエラー
    if (user.isInRoom) {
      return res.status(400).json({ 
        success: false, 
        error: '既に入室中です' 
      });
    }
    
    // 入室処理
    user.isInRoom = true;
    user.lastUpdate = new Date().toISOString();
    
    // ユーザーファイルを更新
    await writeDataFile(USERS_FILE, users);
    
    // ログに記録
    const logs = await readDataFile(LOGS_FILE);
    logs.unshift({
      userID,
      userName: user.userName,
      action: 'enter',
      timestamp: user.lastUpdate,
      comment: comment || null
    });
    
    await writeDataFile(LOGS_FILE, logs);
    
    console.log(`入室記録: ${user.userName} (${userID})`);
    
    res.json({
      success: true,
      message: '入室が記録されました',
      user: { ...user }
    });
    
  } catch (error) {
    console.error('入室処理エラー:', error);
    res.status(500).json({ 
      success: false, 
      error: '入室処理中にエラーが発生しました' 
    });
  }
});

// 退室記録
app.post('/api/users/:userID/exit', async (req, res) => {
  try {
    const { userID } = req.params;
    const { userName, comment } = req.body;
    
    const users = await readDataFile(USERS_FILE);
    const user = users.find(u => u.userID === userID);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'ユーザーが見つかりません' 
      });
    }
    
    // ユーザー名が渡された場合は更新
    if (userName) {
      user.userName = userName;
    }
    
    // 既に退室中の場合はエラー
    if (!user.isInRoom) {
      return res.status(400).json({ 
        success: false, 
        error: '既に退室中です' 
      });
    }
    
    // 退室処理
    user.isInRoom = false;
    user.lastUpdate = new Date().toISOString();
    
    // ユーザーファイルを更新
    await writeDataFile(USERS_FILE, users);
    
    // ログに記録
    const logs = await readDataFile(LOGS_FILE);
    logs.unshift({
      userID,
      userName: user.userName,
      action: 'exit',
      timestamp: user.lastUpdate,
      comment: comment || null
    });
    
    await writeDataFile(LOGS_FILE, logs);
    
    console.log(`退室記録: ${user.userName} (${userID})`);
    
    res.json({
      success: true,
      message: '退室が記録されました',
      user: { ...user }
    });
    
  } catch (error) {
    console.error('退室処理エラー:', error);
    res.status(500).json({ 
      success: false, 
      error: '退室処理中にエラーが発生しました' 
    });
  }
});

// データリセット（開発用）
app.post('/api/reset', async (req, res) => {
  try {
    await writeDataFile(USERS_FILE, initialUsers);
    await writeDataFile(LOGS_FILE, initialLogs);
    console.log('データをリセットしました');
    res.json({ message: 'データをリセットしました' });
  } catch (error) {
    res.status(500).json({ error: 'データのリセットに失敗しました' });
  }
});

// サーバー起動
app.listen(PORT, async () => {
  await initializeDataFiles();
  console.log(`🚀 バックエンドサーバーが起動しました: http://localhost:${PORT}`);
  console.log(`📁 データディレクトリ: ${DATA_DIR}`);
});
