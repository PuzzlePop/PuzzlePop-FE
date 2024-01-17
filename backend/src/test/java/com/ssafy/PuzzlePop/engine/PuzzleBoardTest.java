package com.ssafy.PuzzlePop.engine;

import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

class PuzzleBoardTest {

    @Test
    void initTest() {
        Picture p = new Picture(64, 48, "String");
        PuzzleBoard board = new PuzzleBoard();
        Piece[][] pieces = board.init(p);

        for (int i = 0; i < board.getLengthCnt(); i++) {
            for (int j = 0; j < board.getWidthCnt(); j++) {
                System.out.print(Arrays.toString(pieces[i][j].getType()) + " ");
            }
            System.out.println();
        }
    }
}