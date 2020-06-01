//
//  main.m
//  testRlease
//
//  Created by jie on 2020/5/22.
//  Copyright © 2020 jie. All rights reserved.
//

#import <Foundation/Foundation.h>
static int add(int a,int b) {
    int c = a + b;
    return c;
}


int main(int argc, const char * argv[]) {

    int sum = add(1,2);
    NSLog(@"1 + 2 = %d",sum);
    @autoreleasepool {
        // insert code here...
#ifndef RELEASE
        NSLog(@"Hello, World!");
#endif
    }
    return 0;
}
