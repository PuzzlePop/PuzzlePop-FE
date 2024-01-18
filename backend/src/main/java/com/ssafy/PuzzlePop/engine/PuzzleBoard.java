package com.ssafy.puzzlepop.engine;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PuzzleBoard {
    private Picture picture;
    private Piece[][] pieces;
    private int pieceSize;
    private int widthCnt;
    private int lengthCnt;

    public Piece[][] init(Picture p) {
        picture = p;

        //TODO
        //1. 사진 비율에 따른 여러가지 피스 제공
        //2. 소수인 사이즈를 가진 사진이 들어왔을 때
        pieceSize = GCD(picture.getWidth(), picture.getLength());
        widthCnt = picture.getWidth()/pieceSize;
        lengthCnt = picture.getLength()/pieceSize;

        //퍼즐 조각 초기화
        //고유 인덱스 할당
        //고유 인덱스로 정답 판별할 수 있도록, 상하좌우 주변 퍼즐에 대한 고유 인덱스 정보를 포함하여 초기화
        pieces = new Piece[lengthCnt][widthCnt];
        int cnt = 0;
        for (int i = 0; i < lengthCnt; i++) {
            for (int j = 0; j < widthCnt; j++) {
                pieces[i][j] = new Piece(cnt);
                if (cnt+1 >= widthCnt*(i+1)) {
                    pieces[i][j].setCorrectRightIndex(-1);
                } else {
                    pieces[i][j].setCorrectRightIndex(cnt+1);
                }

                if (cnt-1 < i*widthCnt) {
                    pieces[i][j].setCorrectLeftIndex(-1);
                } else {
                    pieces[i][j].setCorrectLeftIndex(cnt-1);
                }

                if (cnt-widthCnt < 0) {
                    pieces[i][j].setCorrectTopIndex(-1);
                } else {
                    pieces[i][j].setCorrectTopIndex(cnt-widthCnt);
                }

                if (cnt+widthCnt >= widthCnt*lengthCnt) {
                    pieces[i][j].setCorrectBottomIndex(-1);
                } else {
                    pieces[i][j].setCorrectBottomIndex(cnt+widthCnt);
                }

                cnt++;
            }
        }

        //퍼즐 생성 알고리즘 적용
        //조각의 타입 = new int[4]
        //인덱스 0 : 상, 인덱스 1 : 우, 인덱스 2 : 하, 인덱스 3 : 좌
        //값 0 : 평면, 값 1 : 들어간 형태, 값 2 : 튀어나온 형태
        for (int i = 0; i < lengthCnt; i++) {
            for (int j = 0; j < widthCnt; j++) {
                Piece now = pieces[i][j];
                int[] type = new int[4];

                //상단 변
                if (i == 0) {
                    //좌상단 꼭짓점
                    if (j == 0) {
                        //기본 값
                        type[0] = 0;
                        type[3] = 0;

                        //랜덤값
                        type[1] = random(2);
                        type[2] = random(2);
                    }
                    //우상단 꼭짓점
                    else if (j == widthCnt-1) {
                        type[0] = 0;
                        type[1] = 0;

                        type[2] = random(2);
                        type[3] = pieces[i][j-1].getType()[1] == 2 ? 1 : 2;
                    }
                    //그 외 변
                    else {
                        type[0] = 0;

                        type[1] = random(2);
                        type[2] = random(2);
                        type[3] = pieces[i][j-1].getType()[1] == 2 ? 1 : 2;
                    }
                }
                //하단 변
                else if (i == lengthCnt-1) {
                    //좌하단 꼭짓점
                    if (j == 0) {
                        //기본 값
                        type[2] = 0;
                        type[3] = 0;
                        type[0] = pieces[i-1][j].getType()[2] == 2 ? 1 : 2;

                        type[1] = random(2);
                    }
                    //우하단 꼭짓점
                    else if (j == widthCnt-1) {
                        type[0] = pieces[i-1][j].getType()[2] == 2 ? 1 : 2;
                        type[1] = 0;
                        type[2] = 0;
                        type[3] = pieces[i][j-1].getType()[1] == 2 ? 1 : 2;
                    }
                    //그 외 변
                    else {
                        type[0] = pieces[i-1][j].getType()[2] == 2 ? 1 : 2;
                        type[1] = random(2);
                        type[2] = 0;
                        type[3] = pieces[i][j-1].getType()[1] == 2 ? 1 : 2;
                    }
                }

                //꼭짓점을 제외한 좌측 변
                else if (j == 0) {
                    type[0] = pieces[i-1][j].getType()[2] == 2 ? 1 : 2;
                    type[1] = random(2);
                    type[2] = random(2);
                    type[3] = 0;
                }

                //꼭짓점을 제외한 우측 변
                else if (j == widthCnt-1) {
                    type[0] = pieces[i-1][j].getType()[2] == 2 ? 1 : 2;
                    type[1] = 0;
                    type[2] = random(2);
                    type[3] = pieces[i][j-1].getType()[1] == 2 ? 1 : 2;
                }

                //그 외 가운데 부분
                else {
                    type[0] = pieces[i-1][j].getType()[2] == 2 ? 1 : 2;
                    type[1] = random(2);
                    type[2] = random(2);
                    type[3] = pieces[i][j-1].getType()[1] == 2 ? 1 : 2;
                }

                now.setType(type);
            }
        }


        return pieces;
    }

    public int random(int range) {
        return ((int)(Math.random()*range)) + 1;
    }


    public static int GCD(int a, int b) {
        if (b == 0) {
            return a;
        }

        return GCD(b, a%b);
    }
}
