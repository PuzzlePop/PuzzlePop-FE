package com.ssafy.puzzlepop1.engine;

import lombok.*;

@Getter
@Setter
@ToString
public class Piece {
    private int index;
//    private int correctX;
//    private int correctY;
//    private int nowX;
//    private int nowY;
//    private int type;
    private int correctTopIndex;
    private int correctBottomIndex;
    private int correctLeftIndex;
    private int correctRightIndex;
    private int[] type;

    public Piece(int index) {
        this.index = index;
    }
}
