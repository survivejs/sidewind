// TODO

// type PromiseResult = { key: string; values: any };

/*
  let promises: { key: string; promise: Promise<PromiseResult> }[] = [];
  isObject(updatedState) &&
    Object.keys(updatedState).forEach(key => {
      const v = updatedState[key];

      if (v && v.then) {
        promises.push({
          key,
          promise: v.then((values: any) => ({ key, values })),
        });
      }
    });

  if (promises.length > 0) {
    const newState: BindState = {};

    promises.forEach(({ key }) => {
      newState[key] = { status: "loading" };
    });

    stateContainer.state = { ...stateContainer.state, ...newState };
    // evaluate(stateContainer);

    Promise.all(promises.map(({ promise }) => promise)).then(values => {
      const promisedState: BindState = {};

      values.forEach(({ key, values }: PromiseResult) => {
        promisedState[key] = values;
      });

      const newState = { ...stateContainer.state, ...promisedState };

      stateContainer.state = newState;
      // evaluate(stateContainer);
    });
  }
  */
