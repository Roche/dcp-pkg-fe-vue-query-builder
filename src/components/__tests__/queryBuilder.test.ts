import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import QueryBuilder from '../QueryBuilder.vue';

describe('QueryBuilder.vue', () => {
  it('should render', () => {
    const wrapper = mount(QueryBuilder, {
      props: {
        modelValue: {
          type: 'group',
          operator: 'and',
          filters: []
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
  });
});