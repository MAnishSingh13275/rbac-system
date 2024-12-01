const Modal = ({
    children,
    onClose,
  }: {
    children: React.ReactNode;
    onClose: () => void;
  }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4">
          <button
            onClick={onClose}
            className="text-red-500 font-bold float-right"
          >
            &times;
          </button>
          <div>{children}</div>
        </div>
      </div>
    );
  };
  
  export default Modal;
  