package com.ssafy.puzzlepop;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class Test {
    int num;

    public static void main(String[] args) {
        Test test = new Test();
        test.setNum(1);
        System.out.println("test = " + test);
    }
}
