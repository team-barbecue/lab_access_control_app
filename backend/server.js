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
  { userID: 'T001', userName: '田中太郎', isInRoom: false, lastUpdate: null },
  { userID: 'S002', userName: '佐藤花子', isInRoom: true, lastUpdate: '2024-01-20T09:30:00Z' },
  { userID: 'Y003', userName: '山田次郎', isInRoom: false, lastUpdate: null },
];

const initialLogs = [
  { userID: 'S002', userName: '佐藤花子', action: 'enter', timestamp: '2024-01-20T09:30:00Z', comment: '研究のため' },
  { userID: 'T001', userName: '田中太郎', action: 'exit', timestamp: '2024-01-20T08:45:00Z', comment: '作業完了' },
  { userID: 'Y003', userName: '山田次郎', action: 'exit', timestamp: '2024-01-20T08:30:00Z', comment: '外出' },
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
    let user = users.find(u => u.userID === userID);
    
    if (!user) {
      // 新規ユーザーを作成（userNameが渡されていない場合はデフォルト名を使用）
      const defaultUserName = userName || `ユーザー${userID}`;
      user = { userID, userName: defaultUserName, isInRoom: false, lastUpdate: null };
      users.push(user);
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
