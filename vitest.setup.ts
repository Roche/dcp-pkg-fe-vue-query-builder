import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    messages: {
        en: {}
    },
    missingWarn: false,
    fallbackWarn: false
});

config.global.plugins = [i18n];

config.global.stubs = {
    VSelect: true,
    VIcon: true,
    VBtn: true,
    VTooltip: true,
    DcpTextButton: true,
};