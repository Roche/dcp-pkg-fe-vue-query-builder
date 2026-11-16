import { computed, inject } from 'vue';

export function useTranslationPrefix() {
    const raw = inject('translationPrefix', '@open-dcp/i18n');
    const translationPrefix = computed(() =>
        raw.endsWith('.') ? raw : raw + '.'
    );
    return translationPrefix;
}