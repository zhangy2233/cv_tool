var debounce = (f, t) => {
    let flag;
    let func = (...args) => {
        if (flag) clearTimeout(flag);
        flag = setTimeout(() => f(args), t)
    }
    return func
}

exports.debounce = debounce