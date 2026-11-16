import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FilterGroup from '../FilterGroup.vue';

describe('FilterGroup.vue', () => {
  it('should render', () => {
    const wrapper = mount(FilterGroup, {
      props: {
        node: {
          type: 'group',
          operator: 'and',
          filters: []
        },
        isRoot: true
      }
    });

    expect(wrapper.exists()).toBe(true);
  });
});