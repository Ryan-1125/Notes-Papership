---
title: C++的一些输入输出
published: 2025-04-07
description: "一些C++笔记"
tags: [全部笔记,专必,C++]
category: C++
draft: false
---

# 1. 判断一个数是不是素数（函数）
```cpp
#include <iostream>
using namespace std;

bool isPrime(int x) {
    // 小于 2 的数一定不是素数
    if (x < 2) return false;

    // 从 2 遍历到 sqrt(x)，只要能整除，就不是素数
    for (int i = 2; i * i <= x; i++) {
        if (x % i == 0) {
            return false;
        }
    }
    // 都不能整除 → 是素数
    return true;
}
```

### 怎么用？
```cpp
int main() {
    int x;
    cin >> x;
    if (isPrime(x)) {
        cout << x << " 是素数";
    } else {
        cout << x << " 不是素数";
    }
    return 0;
}
```

---

# 2. 求区间 [L, R] 内素数个数（暴力法）
直接循环每个数，调用上面的函数即可。

```cpp

int main() {
    int L, R;
    cin >> L >> R;

    int cnt = 0; // 统计素数个数

    // 遍历 L ~ R 每个数
    for (int i = L; i <= R; i++) {
        if (isPrime(i)) {
            cnt++;
        }
    }

    cout << cnt << endl;
    return 0;
}
```

---

# 3. 埃氏筛（区间素数统计）
如果 **数字范围很大（比如 1~1e6）**，暴力会超时，用**埃氏筛**：

```cpp
#include <iostream>
using namespace std;

const int MAX = 1000005;
bool isPrime[MAX];

// 埃氏筛：把 1~maxn 的素数全部筛出来
void sieve(int maxn) {
    // 先假设所有数都是素数
    for (int i = 0; i <= maxn; i++) isPrime[i] = true;
    isPrime[0] = isPrime[1] = false;

    for (int i = 2; i * i <= maxn; i++) {
        if (isPrime[i]) {
            // 把 i 的倍数全部标记为非素数
            for (int j = i * i; j <= maxn; j += i) {
                isPrime[j] = false;
            }
        }
    }
}

int main() {
    int L, R;
    cin >> L >> R;

    sieve(R); // 筛到 R 即可

    int cnt = 0;
    for (int i = L; i <= R; i++) {
        if (isPrime[i]) cnt++;
    }

    cout << cnt;
    return 0;
}
```

---

# 关键
1. **素数：大于 1，只能被 1 和自己整除**
2. **判断单个素数：循环到 sqrt(x)**
3. **求区间素数：暴力小数据，筛法大数据**
