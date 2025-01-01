-- 既存のテーブルが存在する場合は削除
DROP TABLE IF EXISTS 読みたい本;
DROP TABLE IF EXISTS 書籍;
DROP TABLE IF EXISTS 学生;

-- 学生テーブル
CREATE TABLE 学生 (
    学生証番号 TEXT PRIMARY KEY,
    学生氏名 TEXT NOT NULL
);

--  書籍テーブル
CREATE TABLE 書籍 (
    書籍ID TEXT PRIMARY KEY,    -- Google Books APIのvolume ID
    タイトル TEXT NOT NULL    
);

-- 読みたい本テーブル
CREATE TABLE 読みたい本 (
    学生証番号 TEXT REFERENCES 学生(学生証番号),
    書籍ID TEXT REFERENCES 書籍(書籍ID),
    PRIMARY KEY (学生証番号, 書籍ID)
);

-- 一応
INSERT INTO 学生 (学生証番号, 学生氏名) VALUES
    ('5420365', '矢吹紫'),
    ('5419513', '高橋博之'),
    ('6121M78', '田中淳平');


INSERT INTO 書籍 (書籍ID, タイトル) VALUES
    ('Jb3GNmCzcIoC', 'こころ'),
    ('TnAyb0v7CbYC', '夢十夜'),
    ('Bqp5Em04YgUC', '銀河鉄道の夜');


INSERT INTO 読みたい本 (学生証番号, 書籍ID) VALUES
    ('5420365', 'Jb3GNmCzcIoC'),
    ('5420365', 'TnAyb0v7CbYC'),
    ('5419513', 'Bqp5Em04YgUC');