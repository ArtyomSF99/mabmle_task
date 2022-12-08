import React from "react";

const DeleteForm = ({del, id}) =>{
    const Del = (e) =>{
        e.preventDefault();
       
        del(true, id)
    }
    const Cancle = (e) =>{
        e.preventDefault();
        del(false, id)
    }

    return(
        <div className="delete_modal">
           <div className="modal_text">Are you sure you want to delete?</div>
           <div className="answer">
            <button className="answer_btn1" onClick={Del}>
                Yes
            </button>
            <button className="answer_btn2" onClick={Cancle}>
                No
            </button>
           </div>
        </div>
    )
}

export default DeleteForm;