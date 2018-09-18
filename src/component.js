import { BaseModule, mapGetters } from './lib/BaseModule';

class Component extends BaseModule {
    constructor () {
        super();
        this.setProps(['options']);
        this.setComponent({});
        this.setMethod({
            setOptions () {
                let options = this.options || {};
                this.isShow = !!options.isShow;
                this.title = options.title || '';
                this.content = options.content || '';
                this.onHide = typeof options.onHide === 'function' ? options.onHide : null;
                this.onCancel = typeof options.onCancel === 'function' ? options.onCancel : null;
                this.onConfirm = typeof options.onConfirm === 'function' ? options.onConfirm : null;
                this.primaryColor = typeof options.primaryColor === 'string' && options.primaryColor.indexOf('#') === 0 ? options.primaryColor : '#00AAEE';
                this.confirmButtonColor = typeof options.confirmButtonColor === 'string' && options.confirmButtonColor.indexOf('#') === 0 ? options.confirmButtonColor : '#00AAEE';
                this.cancelButtonColor = typeof options.cancelButtonColor === 'string' && options.cancelButtonColor.indexOf('#') === 0 ? options.cancelButtonColor : '#00AAEE';
                this.showMask = typeof options.showMask === 'boolean' ? options.showMask : false;
                this.autoDismiss = typeof  options.autoDismiss === 'boolean' ? options.autoDismiss : true;
                this.selectItem = options.selectItem || [];
                this.maxCount = Math.max(1, typeof options.maxCount === 'number' ? options.maxCount : 1);
                this.$nextTick(() => {
                    let el = this.$el.querySelector('.dialog-area');
                    if (el) {
                        el.style.marginTop = `${(this.windowHeight - el.offsetHeight) / 2}px`;
                    }
                });
            },
            hide () {
                this.onHide && this.onHide();
            },
            cancel () {
                this.onCancel && this.onCancel();
                this.tryToHide();
            },
            confirm () {
                let itemList = this.itemList || {};
                let selected = Object.keys(itemList).filter((item) => {
                    return !!itemList[item];
                });
                if (selected.length < 1) {
                    this.selectWarnMessage = '至少选择一个选项';
                    this.$nextTick(() => {
                        this.warnMessageShake = true;
                    });
                } else {
                    this.selectWarnMessage = '';
                    this.itemList = {};
                    this.onConfirm && this.onConfirm(selected);
                    this.tryToHide();
                }
            },
            tryToHide () {
                if (this.autoDismiss) {
                    this.hide();
                }
            },
            onSelected (index) {
                let itemList = this.itemList || {};
                let maxCount = this.maxCount;
                if (maxCount < 2) {
                    itemList[index] = true;
                    this.itemList = itemList;
                    this.confirm();
                } else {
                    let selected = Object.keys(itemList).filter((item) => {
                        return !!itemList[item];
                    });
                    let currentStatus = itemList[index];
                    if (selected.length < maxCount || currentStatus) {
                        itemList[index] = !currentStatus;
                        this.itemList = itemList;
                        this.selectItem = this.selectItem.concat();
                    }
                }
            }
        });
        this.setCompute({
            ...mapGetters({
                windowHeight: 'windowHeight',
                windowWidth: 'windowWidth',
                appConfig: 'appConfig'
            })
        });
        this.setWatch({
            options () {
                this.setOptions();
            },
            shake (value) {
                if (value) {
                    let self = this;
                    if (self.autoDismiss) {
                        self.shake = false;
                        self.hide();
                    } else {
                        setTimeout(() => {
                            self.shake = false;
                        }, 300);
                    }
                }
            },
            warnMessageShake (value) {
                if (value) {
                    let self = this;
                    setTimeout(() => {
                        self.warnMessageShake = false;
                    }, 300);
                }
            }
        });
    }

    getData () {
        return {
            isShow: false,
            title: '',
            content: '',
            autoDismiss: true,
            defaultWidth: '',
            defaultHeight: '',
            showMask: false,
            shake: false,
            selectItem: [],
            maxCount: 1,
            maxHeight: 'auto',
            itemList: {},
            selectWarnMessage: '',
            primaryColor: '#00AAEE',
            confirmButtonColor: '#00AAEE',
            cancelButtonColor: '#00AAEE',
            warnMessageShake: false
        };
    }

    onCreate () {
        let app = this.app;
        app.setOptions();
        app.defaultWidth = window.innerWidth;
        app.defaultHeight = window.innerHeight;
    }

    onMount () {
    }
}

module.exports = Component;
