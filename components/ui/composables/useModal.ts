import { useScrollLock, useEventBus } from '@vueuse/core';

interface ModalData {
  transition?: string,
  dropdown?: boolean,
  noLock?: boolean,
  absolute?: boolean,
  isNotClosable?: boolean,
  custom?: boolean,
  props?: Record<string, unknown>;
  [key: string]: any;
}

let popstateHandler: EventListener | undefined;
const list : Record<string, any>[] = reactive([]);
const hasModal = computed(() => list.length > 0);
const lock = useScrollLock(document.body);
const bus = useEventBus<string>('modal');

export const useModal = () => {
  const onClickBack = (id?: number | undefined) => {
    close(id, true);
  };

  const open = (component: Component, data: ModalData) => {
    if (popstateHandler) {
      // sometimes pushState can trigger unwanted closings of modals
      window.removeEventListener('popstate', popstateHandler);
    }
    const id = Math.random();
    list.push({
      id,
      component: markRaw(component),
      data
    });
    popstateHandler = () => onClickBack(id);
    window.history.pushState(id, component.name || 'Modal window');
    window.addEventListener('popstate', popstateHandler);

    if (!data.noLock) {
      lock.value = true;
    }

    if (data.absolute) {
      bus.emit('open');
    }
  };

  const close = (id?: number | undefined, isBack = false) => {
    if (popstateHandler) {
      window.removeEventListener('popstate', popstateHandler);
      popstateHandler = undefined;
    }

    if (!id) {
      list.pop();
    } else {
      list.splice(list.findIndex(item => item.id === id), 1);
    }

    if (!isBack) {
      window.history.back();
    }

    if (!hasModal.value) {
      lock.value = false;
    }

    bus.emit('close');
  };

  return {
    list,
    open,
    close,
    hasModal
  };
};
