const validateScoreEvent = (event) => {
  if (!event.details.lab) {
    return {
      name: 'invalid_options',
    };
  }
  return event;
};

const validate = (showEvent) => {
  switch (showEvent.name) {
    case 'score':
      return validateScoreEvent(showEvent);
    default:
      return showEvent;
  }
};

module.exports = {
  validate,
};
