# 가상화폐 지갑 별 거래내역 보고서 생성기

## Background

익명의 친구에 따르면, [Etherscan](https://etherscan.io/)에서 제공하는 **지갑 별 일일 거래내역 조회 기능**을 사용해 상장이 임박한 가상화폐가 무엇인지 예측할 수 있으며, 이를 통해 상당한 수익을 창출할 수 있다고 한다.

하지만 수십개가 넘는 지갑을 하나씩 조회하며 모든 거래내역을 표로 정리하는 방식은 많은 시간을 필요로하며, 사람에 의한 수작업이므로 실수가 발생할 수 있고, 이는 예측 확률 저하의 원인이 된다.

따라서 **Etherscan API**를 통해 상기한 작업과정을 자동화하여, 상장 될 가상화폐를 예측하는데 소요되는 시간을 줄임과 동시에 실수를 차단하고, 예측 확률의 저하를 방지한다.

## How to run?

1. [Node.js 다운로드 페이지](https://nodejs.org/ko/)에서 **LTS 버전**을 다운로드 받아 설치한다.

2. 터미널에서 명령어 `node -v`와 `npm -v`를 실행해 정상적으로 설치되었는지 확인한다.

3. 터미널에서 `git clone https://github.com/tom9744/Bitcoin-Transaction-Reporter`를 실행해 본 레포지토리의 내용을 다운로드 받는다.

4. `Bitcoin-Transaction-Reporter/` 폴더 위치로 이동한다.

5. `npx serve`를 실행한 뒤, `http://localhost:5000/`으로 접속한다.
