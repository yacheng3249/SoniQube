import React, {
  useContext,
  createContext,
  useReducer,
  useMemo,
  memo,
} from "react";
import styled from "styled-components";

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
        <DialogOverlay open={open} onClose={_onClose}>
          <Dialog>
            <h2>{switchData["title"]}</h2>
            <p>{switchData["contentText"]}</p>
            <DialogButtons>
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
            </DialogButtons>
          </Dialog>
        </DialogOverlay>
      )}
    </>
  );
};

const DialogOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30%;
  z-index: 999;
  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;

const Dialog = styled.div`
  background-color: rgb(65, 65, 65);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  opacity: 1;
  h2 {
    margin-top: 0;
    font-size: 18px;
    color: white;
  }
  p {
    color: white;
    font-size: 12px;
  }
`;

const DialogButtons = styled.div`
  margin-top: 48px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  button {
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 16px;
    margin: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    background-color: #007bff;
    color: #fff;

    &:hover {
      background-color: #f1f1f1;
    }
  }
`;
