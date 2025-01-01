import psycopg
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)

def get_db_connection():
    return psycopg.connect(
        host='localhost',
        dbname='booksSearch',
        user='watanabe_aya',
        password='password'
    )


@app.route('/')
def index():
    return '''
    <h1>読みたい本リストAPI</h1>
    <h2>利用可能なエンドポイント：</h2>
    <ul>
        <li><a href="/students">GET /students</a> - 学生一覧</li>
        <li><a href="/books">GET /books</a> - 書籍一覧</li>
        <li><a href="/wishlist">GET /wishlist</a> - 読みたい本一覧</li>
    </ul>
    '''

@app.route('/login', methods=['POST'])
def login():
    content = request.get_json()
    print("受信:", content)

    # データベース接続の確認
    try:
        conn = get_db_connection()
        print("データベース接続成功")
    except Exception as e:
        print("データベース接続エラー:", str(e))
        return jsonify({
            'success': False,
            'message': 'データベース接続エラー'
        }), 500

    with conn:
        try:
            
            check_sql = "SELECT * FROM 学生"  # 全データ確認用
            all_data = conn.execute(check_sql).fetchall()
            print("データベース内の全データ:", all_data) 

            sql = '''SELECT 学生証番号, 学生氏名 
                     FROM 学生 
                     WHERE 学生証番号 = %(学生証番号)s'''
            existing_user = conn.execute(sql, content).fetchone()
            print("検索結果:", existing_user)  

            if not existing_user:
                # 新規ユーザー登録
                print("新規ユーザー登録開始") 
                insert_sql = '''INSERT INTO 学生 (学生証番号, 学生氏名) 
                               VALUES (%(学生証番号)s, %(学生氏名)s) 
                               RETURNING 学生証番号, 学生氏名'''
                new_user = conn.execute(insert_sql, content).fetchone()
                conn.commit()
                print("新規ユーザー登録成功:", new_user) 

                response = {
                    'success': True,
                    'student': {
                        '学生証番号': new_user[0],
                        '学生氏名': new_user[1]
                    },
                    'message': '新規登録が完了しました'
                }
                print("送信するレスポンス:", response) 
                return jsonify(response), 200

            # 既存ユーザーの処理
            if existing_user[1] == content['学生氏名']:
                response = {
                    'success': True,
                    'student': {
                        '学生証番号': existing_user[0],
                        '学生氏名': existing_user[1]
                    }
                }
                print("送信するレスポンス:", response)  
                return jsonify(response), 200
            else:
                response = {
                    'success': False,
                    'message': '学生氏名が一致しません'
                }
                print("送信するレスポンス:", response) 
                return jsonify(response), 401

        except Exception as e:
            print("エラー発生:", str(e))
            conn.rollback()
            return jsonify({
                'success': False,
                'message': f'エラーが発生しました: {str(e)}'
            }), 500

@app.route('/students', methods=['GET'])
def get_students():
    with get_db_connection() as conn:
        try:
            result = conn.execute('SELECT 学生証番号, 学生氏名 FROM 学生')
            students = [dict(zip(['学生証番号', '学生氏名'], row)) for row in result]
            return jsonify(students)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/students', methods=['POST'])
def post_student():
    content = request.get_json()
    with get_db_connection() as conn:
        try:
            sql = 'INSERT INTO 学生 (学生証番号, 学生氏名) VALUES (%(学生証番号)s, %(学生氏名)s)'
            conn.execute(sql, content)
            return jsonify({'message': 'created'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/books', methods=['GET'])
def get_books():
    with get_db_connection() as conn:
        try:
            result = conn.execute('SELECT 書籍ID, タイトル FROM 書籍')
            books = [dict(zip(['書籍ID', 'タイトル'], row)) for row in result]
            return jsonify(books)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/books', methods=['POST'])
def post_book():
    content = request.get_json()
    with get_db_connection() as conn:
        try:
            sql = 'INSERT INTO 書籍 (書籍ID, タイトル) VALUES (%(書籍ID)s, %(タイトル)s)'
            conn.execute(sql, content)
            return jsonify({'message': 'created'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/wishlist', methods=['GET'])
def get_wishlist():
    with get_db_connection() as conn:
        try:
            sql = '''
                SELECT 
                    読みたい本.学生証番号,
                    学生.学生氏名,
                    読みたい本.書籍ID,
                    書籍.タイトル
                FROM 読みたい本
                JOIN 学生 ON 読みたい本.学生証番号 = 学生.学生証番号
                JOIN 書籍 ON 読みたい本.書籍ID = 書籍.書籍ID
                ORDER BY 読みたい本.学生証番号, 書籍.書籍ID
            '''
            result = conn.execute(sql)
            wishlist = [dict(zip(['学生証番号', '学生氏名', '書籍ID', 'タイトル'], row)) for row in result]
            return jsonify(wishlist)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/wishlist', methods=['POST'])
def post_wishlist():
    content = request.get_json()
    print("受信したデータ:", content)

    with get_db_connection() as conn:
        try:
            # まず書籍テーブルに本を追加
            insert_book_sql = '''
                INSERT INTO 書籍 (書籍ID, タイトル)
                VALUES (%(書籍ID)s, %(タイトル)s)
                ON CONFLICT (書籍ID) DO UPDATE 
                SET タイトル = EXCLUDED.タイトル
            '''
            
            conn.execute(insert_book_sql, {
                '書籍ID': content['書籍ID'],
                'タイトル': content['タイトル']
            })

            # 次に読みたい本テーブルに追加
            insert_wishlist_sql = '''
                INSERT INTO 読みたい本 (学生証番号, 書籍ID)
                VALUES (%(学生証番号)s, %(書籍ID)s)
                ON CONFLICT (学生証番号, 書籍ID) DO NOTHING
            '''
            
            conn.execute(insert_wishlist_sql, {
                '学生証番号': content['学生証番号'],
                '書籍ID': content['書籍ID']
            })
            
            conn.commit()
            return jsonify({'message': '追加しました'}), 201

        except Exception as e:
            print("エラー発生:", str(e))
            conn.rollback()
            return jsonify({'error': str(e)}), 500

@app.route('/wishlist/<student_id>/<book_id>', methods=['DELETE'])
def delete_wishlist(student_id, book_id):
    with get_db_connection() as conn:
        try:
            sql = 'DELETE FROM 読みたい本 WHERE 学生証番号 = %s AND 書籍ID = %s'
            conn.execute(sql, [student_id, book_id])
            return jsonify({'message': 'deleted'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    print("サーバー起動中...") 
    app.run(debug=True)