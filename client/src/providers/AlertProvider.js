import React, {
  useContext,
  createContext,
  useReducer,
  useMemo,
  memo,
} from "react";

const AlertContext = createContext();

const defaultAlertData = {
  title: "",
  contentText: "",
  action: { text: "Confirm", onClick: () => {} },
};

export const useAlert = () => {
  const alertDataDispatch = useContext(AlertContext);
  const defaultAlertAction = defaultAlertData["action"];

  const alert = (title, contentText, actions) => {
    alertDataDispatch({
      type: "open",
      data: {
        title: title || defaultAlertData["title"],
        contentText: contentText || defaultAlertData["contentText"],
        actions: actions.map((item) => {
          return {
            text: item.text || defaultAlertAction["text"],
            onClick: item.onClick || defaultAlertAction["onClick"],
          };
        }),
      },
    });
  };

  const notify = (contentText, action, text) => {
    alertDataDispatch({
      type: "open",
      data: {
        title: defaultAlertData["title"],
        contentText: contentText || defaultAlertData["contentText"],
        actions: [
          {
            text: text || defaultAlertAction["text"],
            onClick: action || defaultAlertAction["onClick"],
          },
        ],
      },
    });
  };
  return { alert, notify };
};

const AlertProvider = ({ children }) => {
  const alertDataInit = [];
  const alertDataReducer = (state, action) => {
    switch (action.type) {
      case "open":
        return [...state, action.data];
      case "close":
        return state.filter((_, index) => index !== action.index);
      default:
        return alertDataInit;
    }
  };

  const [alertData, alertDataDispatch] = useReducer(
    alertDataReducer,
    alertDataInit
  );
  return (
    <AlertContext.Provider value={alertDataDispatch}>
      {children}
      <AlertModal data={alertData} reducerDispatch={alertDataDispatch} />
    </AlertContext.Provider>
  );
};
export default memo(AlertProvider);

const AlertModal = ({ data = [], reducerDispatch = () => {} }) => {
  const open = Boolean(data[0]);
  const lastIndex = data.length - 1;

  const switchData = useMemo(() => {
    if (open) {
      return data[lastIndex];
    }
  }, [data, lastIndex, open]);

  const _onClose = () => {
    reducerDispatch({ type: "close", index: lastIndex });
  };

  return (
    <>
      {open && (
        <div className="alert" open={open} onClose={_onClose}>
          <div className="alert-content">
            <h2>{switchData["title"]}</h2>
            <p>{switchData["contentText"]}</p>
            <div className="alert-button">
              {switchData["actions"].map(({ text, onClick }) => (
                <button
                  onClick={() => {
                    if (onClick) {
                      onClick();
                    }
                    _onClose();
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
