
export default {
    toDateKey:function(_theDate) {
        return _theDate.getFullYear() + "" + ("00"+(_theDate.getMonth()+1)).slice(-2) + "" + ("00"+_theDate.getDate()).slice(-2);
    }
};
