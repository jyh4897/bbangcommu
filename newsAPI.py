import requests # HTTP 요청 / 웹 페이지의 HTML 내용을 가져오거나 API로부터 데이터 요청 가능
from bs4 import BeautifulSoup # HTML 문서 파싱(분석, 원하는 데이터 가져옴) 및 검색
import pymysql # MySQL과 상호 작용
import csv # CSV파일 읽기 및 생성
import re # 정규표현식을 사용 할 수 있게 해줌[내장]
import os # 운영 체제와 상호 작용(디렉토리 및 파일 관리, 경로 조작, 실행 등)[내장]
from datetime import datetime # 날짜, 시간 다루는 클래스나 함수 제공 모듈[내장]
from dotenv import load_dotenv # env 파일 사용

load_dotenv()

NCI = os.environ.get('NAVER_CLIENT_ID')
NCS = os.environ.get('NAVER_CLIENT_SECRET')
DB_HOST = os.environ.get('DB_HOST')
DB_PORT = int(os.environ.get('DB_PORT'))
DB_USER = os.environ.get('DB_USER')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_DATABASE = os.environ.get('DB_DATABASE')

# 네이버 검색 API 설정
naver_client_id = NCI # 네이버 API 클라이언트 ID
naver_client_secret = NCS # 네이버 API 클라이언트 SECRET
news_url = 'https://openapi.naver.com/v1/search/news.json'
query = '탄소중립' # 검색어 지정

# 네이버 검색 API 호출
headers = {'X-Naver-Client-Id': naver_client_id, 'X-Naver-Client-Secret': naver_client_secret}
# query : 검색어, display : 한 번에 표시할 검색 결과 개수(기본값 10. 최댓값 100), sort : (sim 정확도순 내림차순(기본값), date 날짜 내림차순)
params = {'query': query, 'display': 100, 'sort': 'date'}
response = requests.get(news_url, headers=headers, params=params)
result = response.json()

# MySQL 연결 설정
db = pymysql.connect(host=DB_HOST, port=DB_PORT, user=DB_USER, password=DB_PASSWORD, database=DB_DATABASE) # 사용 DB 지정
cursor = db.cursor() # DB와 연결된 커서 객체 생성

# 'items' 라는 키와 리스트 형태의 값을 가진 딕셔너리 생성
csv_data = {'items': []}

# 이미지가 없는 경우 공백 지정
no_image = ''
# 네이버 기사 사진 없는 경우 대체되는 기본이미지
basic_image = 'data:image/png;base64,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'

idx = 1

# 데이터 삽입
for item in result['items']:
    url = item['link']
    pubDate_str = item['pubDate']  # 기존 문자열 형식의 날짜
    pubDate_str = re.sub(r'\s\+\d{4}$', '', pubDate_str) # 날짜의 문자열에 있는 +0900 없애기
    pubDate = datetime.strptime(pubDate_str, "%a, %d %b %Y %H:%M:%S")  # 날짜 문자열을 datetime 객체로 변환
    
    url_pattern = re.compile(r'^https://n\.news\.naver\.com/mnews/article/.*') # 추출할 기사 url 정규표현식 지정
    

    if idx <= 20:
        if url_pattern.match(url):
            # url값의 HTTP GET 요청 후 응답을 변수에 저장
            response_article = requests.get(url)
            # .text: 응답받은 값 텍스트로 추출 / 'html.parser': Python 내장 HTML 파서
            soup = BeautifulSoup(response_article.text, 'html.parser')
            # 기사 본문 제목 가져오기
            title_tag = soup.find('h2', {'id': 'title_area'}) # h2 태그의 id 값이 title_area인 것 찾아서 변수에 저장
            # title_tag가 존재하면 텍스트화 시키고 좌우 공백 제거한 값을 title에 저장 title_tag가 없으면 item['title'] 저장
            title = title_tag.text.strip() if title_tag else item['title']
            # 기사 본문 텍스트 가져오기
            article_tag = soup.find('article', {'id': 'dic_area'})
            content = article_tag.text.strip() if article_tag else 'No Content'
            # 기사 본문 이미지 가져오기
            img_tag = soup.find('img', {'id': 'img1'})
            # img_tag가 존재하고 'data-src' 속성이 있다면
            if img_tag and 'data-src' in img_tag.attrs:
                if img_tag['data-src'] == basic_image: # 기사 자체에 기본이미지로 설정되어 있는 경우
                    image_url = no_image
                else:
                    image_url = img_tag['data-src'] # img_tag의 data-src 속성값을 변수에 저장
            else:
                image_url = no_image
            # 데이터 삽입 쿼리 실행
            insert_query = "INSERT INTO news (image_url, title, url, pubDate) VALUES (%s, %s, %s, %s);" # %s는 쿼리 실행시 값 지정
            cursor.execute(insert_query, (image_url, title, url, pubDate)) # SQL 쿼리 실행
            csv_data['items'].append({'title': title, 'content': content})
            idx += 1
        else:
            continue
    else:
        break


# DB 변경사항 저장
db.commit()

# CSV 파일 생성 및 데이터 추가
csv_columns = ['title', 'content']
csv_rows = []

for item in csv_data['items']:
    onlyKorTitle = re.sub(r"[^가-힣\s]|\b있\w*|기자|기업", "", item['title']) # 한글이나 공백이 아닌것 "" 처리 해서 지움
    onlyKorContent = re.sub(r"[^가-힣\s]|\b있\w*|기자|기업", "", item['content']) # 한글이나 공백이 아닌것 "" 처리 해서 지움 
    csv_rows.append({'title': onlyKorTitle, 'content': onlyKorContent})

# CSV 파일명 지정
csv_file = 'news_data.csv'

# CSV 파일 생성
with open(csv_file, 'w', newline='', encoding='utf8') as csv_file:
    csv_writer = csv.DictWriter(csv_file, delimiter='|', quotechar="'", fieldnames=csv_columns)
    csv_writer.writeheader()
    csv_writer.writerows(csv_rows)

# 커서 및 연결 종료
cursor.close()
db.close()