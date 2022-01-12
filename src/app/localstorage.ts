
const getAngularLS = () => {
    let AngularLS: any = window.localStorage.getItem('AngularLS')
    return JSON.parse(AngularLS)
}

const checkAngularLS = () => {
    return Boolean(getAngularLS())
}

const createAngularLS = (): Object => {
    const AngularLS = {}
    window.localStorage.setItem('AngularLS', JSON.stringify(AngularLS))
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
    let localStorage = getAngularLS()
    const componentLS = localStorage[componentName]
    componentLS[key] = value
    window.localStorage.setItem('AngularLS', JSON.stringify(localStorage))
}

const getLSValue = (componentName: string, key: string) => {
    let localStorage = getAngularLS()
    const componentLS = localStorage[componentName]
    const appValue = componentLS[key]
    return appValue
}

const InitComponentLS = (componentName: string) => {
    let AngularLS: Object

    if (!checkAngularLS()) {
        AngularLS = createAngularLS()
    } else {
        AngularLS = getAngularLS()
    }

    if (!checkComponentLS(AngularLS, componentName)) {
        createComponentLS(AngularLS, componentName)
    } else {
        getComponentLS(AngularLS, componentName)
    }
}


export const cached = (): any => {

    return (target: Object, key: string) => {

        const componentName = target.constructor.name

        InitComponentLS(componentName)

        let val: any = target[key]
        let setTimes = 0

        const getter = () => {
            let localStorageVal = getLSValue(componentName, key)
            return localStorageVal ?? val
        }

        const setter = (newVal: any) => {
            setTimes++
            let localStorageVal = getLSValue(componentName, key)

            val = localStorageVal ?? newVal
            if (setTimes === 1) return

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
