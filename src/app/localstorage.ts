const checkAngularLS = () => {
    return Boolean(window.localStorage.getItem('AngularLS'))
}

const createAngularLS = (): Object => {
    const AngularLS = {}
    window.localStorage.setItem('AngularLS', JSON.stringify(AngularLS))
    return AngularLS
}

const getAngularLS = () => {
    let AngularLS: any = window.localStorage.getItem('AngularLS')
    AngularLS = JSON.parse(AngularLS)
    return AngularLS
}

const checkComponentLS = (AngularLS: object, componentName: string) => {
    return Boolean((AngularLS[componentName]))
}

const createComponentLS = (AngularLS: object, componentName: string) => {
    const componentLS = {}
    AngularLS[componentName] = componentLS
    window.localStorage.setItem('AngularLS', JSON.stringify(AngularLS))
    return componentLS
}

const getComponentLS = (AngularLS: object, componentName: string): Object => {
    return AngularLS[componentName]
}

const setLSValue = (componentName: string, key: string, value: any) => {
    let localStorage = window.localStorage.getItem('AngularLS')
    localStorage = JSON.parse(localStorage)
    const componentLS = localStorage[componentName]
    componentLS[key] = value
    window.localStorage.setItem('AngularLS', JSON.stringify(localStorage))
}

const getLSValue = (componentName: string, key: string) => {
    let localStorage = window.localStorage.getItem('AngularLS')
    localStorage = JSON.parse(localStorage)
    const componentLS = localStorage[componentName]
    const appValue = componentLS[key]
    return appValue
}


export const cached = (): any => {

    return (target: Object, key: string) => {

        const componentName = target.constructor.name

        let AngularLS: Object
        let componentLS: Object

        if (!checkAngularLS()) {
            AngularLS = createAngularLS()
        } else {
            AngularLS = getAngularLS()
        }

        if (!checkComponentLS(AngularLS, componentName)) {
            componentLS = createComponentLS(AngularLS, componentName)
        } else {
            componentLS = getComponentLS(AngularLS, componentName)
        }

        let val: any = target[key]
        let setTimes = 0

        const getter = () => {

            let localStorageVal = getLSValue(componentName, key)
            return localStorageVal ?? val

        }

        const setter = (newVal: any) => {

            setTimes++
            let localStorageVal = getLSValue(componentName, key)

            if (setTimes === 1) {
                val = localStorageVal ?? newVal
                return
            }

            setLSValue(componentName, key, newVal)

            val = newVal
        }

        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        })

    }

}
