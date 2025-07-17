import { useEffect, useRef, useState } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { useRequest } from '../../js/config/requests';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import StandardModal from '../cmmn/StandardModal';
import InputWithLabel from '../cmmn/InputWithLabel';

const Products = () => {
    const request = useRequest();
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [search, setSearch] = useState('');
    const [productList, setProductList] = useState([]);
    const [pageData, setPageData] = useState({totalPages:0, currentPage:0});


    

    const requestProductList = async () => {
        const options = {method : 'GET'};
        const result = await request(`/buy/myproducts?currentPage=${pageData.currentPage}&search=${search}`, options);
        const { success, message, data, page } = result;
    
        if(success){
            setProductList(data);
            setPageData(page);
        }else{
            if(message == "noAuth"){
                toast.error("로그인 후 이용 가능한 서비스 입니다.", {
                    position: "bottom-center"
                });
                setTimeout(() => {
                    navigate("/login")
                }, 2000);
                return;
            }else{
                toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
                    position: "bottom-center"
                });
            }
        }
    }

    const searchHandler = () => {
        if(pageData.currentPage == 1){ // 현재 페이지가 1페이지인 경우 그냥 호출
            requestProductList();
        }else{ // 아닌 경우 currentPage를 변경 시켜 useEffect 동작 처리
            setPageData({
                totalPages:pageData.totalPages,
                currentPage:1
            });
        }
    }

    const handleCurrentPage = (page) => {
        setPageData({
            totalPages:pageData.totalPages,
            currentPage:page
        });
    }


    const [statusCodes, setStatusCodes] = useState();

    useEffect(() => {
        if(pageData.currentPage > 0){ // 조회 페이지 정보가 0 이하인 경우 동작 X
            requestProductList();
        }
    }, [pageData.currentPage]);


    useEffect(() => {
        if(!statusCodes){
            const requestStatusCodes = async () => {
                const options = {
                    method : "GET"
                }
                let result = await request("/common/code/C003", options);
                setStatusCodes(result.data);
                setPageData({totalPages:1, currentPage:1});
            }
            requestStatusCodes();
        }
    }, []) // 최초한번 실행


    const toggleDeleted = async (productId, isDeleted) => {
        const options = {
            method:'PATCH',
            body : {
                productId:productId, 
                isDeleted:isDeleted
            }
        }
        const result = await request('/product/changeIsDeleted', options);
        const { success, message } = result;
    
        if(success){
            requestProductList();
        }else{
            if(message == "noAuth"){
                toast.error("로그인 후 이용 가능한 서비스 입니다.", {
                    position: "bottom-center"
                });
                setTimeout(() => {
                    navigate("/login")
                }, 2000);
                return;
            }else{
                toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
                    position: "bottom-center"
                });
            }
        }
    }


    const changeBuyStatus = async (userId, productId, status) => {
        const options = {
            method:'PATCH',
            body : {
                userId:userId, 
                productId:productId, 
                status:status
            }
        }
        const result = await request('/buy/changeStatus', options);
        const { success, message, data} = result;
    
        if(success){
            requestProductList();
            setSelectedProduct(data);
        }else{
            if(message == "noAuth"){
                toast.error("로그인 후 이용 가능한 서비스 입니다.", {
                    position: "bottom-center"
                });
                setTimeout(() => {
                    navigate("/login")
                }, 2000);
                return;
            }else{
                toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
                    position: "bottom-center"
                });
            }
        }
    }

    const [isRegModalShow, setIsRegModalShow] = useState(false);
    const [regModalData, setRegModalData] = useState();
    
    const showRegModal = (productId) => {
        setRegProductFormData(productId > 0 ? selectedProduct : undefined)
        setRegModalData({
            title : `상품 ${productId == 0 ? '등록' : '수정'}`,
            okEvent: regProductFormSubmit,
            cancelEvent:() => setIsRegModalShow(false),
            closeEvent : () => setIsRegModalShow(false),
            size:{
                width:"50%",
                height:"auto"
            }
        })
        setIsRegModalShow(true);
    }


    const [regProductFormData, setRegProductFormData] = useState();
    
    const regProductFormHandleChange = (e) => {
        const { name, value } = e.target;
        const inputObj = {
            ...regProductFormData, [name]: value,
        }
        setRegProductFormData(inputObj);
    };

    const regProductFormSubmit = async (e) => {
        e.preventDefault();
        // const { productId, name, description, price, sessionCnt } = regProductFormData;
        // console.log(regProductFormData)

        const formElement = document.querySelector('#regProductForm');
        const formData = new FormData(formElement);
        const json = Object.fromEntries(formData.entries());
        const { productId, name, description, price, sessionCnt } = json;

        const options = {
            method:'POST',
            body : {
                productId:productId,
                name:name,
                description:description,
                price:price,
                sessionCnt:sessionCnt
            }
        }
        const result = await request('/product/reg', options);

        const { success, message, data } = result;
    
        if(success){
            setRegProductFormData(null);
            setIsRegModalShow(false);

            if(productId > 0){
                setSelectedProduct(data);
            }
            
            if(productId == 0){ // 등록인 경우 1페이지 이동
                if(pageData.currentPage == 1){ // 현재 페이지가 1페이지인 경우 그냥 호출
                    requestProductList();
                }else{ // 아닌 경우 currentPage를 변경 시켜 useEffect 동작 처리
                    setPageData({
                        totalPages:pageData.totalPages,
                        currentPage:1
                    });
                }
            }else{
                requestProductList();
            }
        }else{
            if(message == "noAuth"){
                toast.error("로그인 후 이용 가능한 서비스 입니다.", {
                    position: "bottom-center"
                });
                setTimeout(() => {
                    navigate("/login")
                }, 2000);
                return;
            }else{
                toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
                    position: "bottom-center"
                });
            }
        }


    };


    const sideDetailLayoutRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sideDetailLayoutRef.current && !sideDetailLayoutRef.current.contains(e.target)) {
                setSelectedProduct(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedProduct])



    return (
        <div className="bg-[#fdf6ec] min-h-screen p-4 relative overflow-x-hidden">
            {(isRegModalShow && (
                <StandardModal
                    title={regModalData.title} 
                    okEvent={regModalData.okEvent}
                    size={regModalData.size}
                    cancelEvent={regModalData.cancelEvent}
                    closeEvent={regModalData.closeEvent}>
                    <form id="regProductForm">
                        <input type='hidden' name='productId' value={regProductFormData?.productId == undefined ? 0 : regProductFormData?.productId}/>
                        <div className='mb-1.5'>
                            <InputWithLabel 
                                label="상품명" 
                                name="name" 
                                className={` w-full flex gap-2 items-center justify-between text-sm sm:text-[1rem]`}
                                value={regProductFormData?.name} 
                                onChange={regProductFormHandleChange} 
                                placeholder="상품명을 입력해주세요"/>
                        </div>
                        <div className='mb-1.5'>
                            <InputWithLabel 
                                label="상품설명" 
                                name="description" 
                                className={` w-full flex gap-2 items-center justify-between text-sm sm:text-[1rem]`}
                                value={regProductFormData?.description} 
                                onChange={regProductFormHandleChange} 
                                placeholder="상품설명을 입력해주세요"/>
                        </div>
                        <div className='mb-1.5'>
                            <InputWithLabel 
                                label="가격" 
                                name="price"
                                className={` w-full flex gap-2 items-center justify-between text-sm sm:text-[1rem]`}
                                isNumber={true} 
                                value={regProductFormData?.price} 
                                onChange={regProductFormHandleChange} 
                                placeholder="가격을 입력해주세요"/>
                        </div>
                        <div className=''>
                            <InputWithLabel 
                                label="상품 제공 횟수"
                                name="sessionCnt"
                                className={` w-full flex gap-2 items-center justify-between text-sm sm:text-[1rem]`}
                                isNumber={true} 
                                value={regProductFormData?.sessionCnt} 
                                onChange={regProductFormHandleChange} 
                                placeholder="상품 제공 횟수를 입력해주세요"/>
                        </div>
                    </form>
                </StandardModal>
            ))}


            {/* 🔍 검색 + 등록 버튼 */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                <div className="flex items-center justify-between w-full sm:w-auto bg-white rounded-md shadow-md px-3 py-2 border border-gray-200">
                    <FiSearch className="text-gray-500 mr-2" />
                    <input type="text" className="outline-none w-45 sm:w-70 text-sm" placeholder="검색어를 입력해주세요." value={search} onChange={(e) => {setSearch(e.target.value);}}/>
                    <button type="button" className="bg-[var(--color-green-700)] text-white px-4 py-2 rounded-md ml-2 hover:bg-[var(--color-green-600)] transition text-sm sm:text-[1rem]" onClick={searchHandler}>검색</button>
                </div>

                <button className="flex w-full justify-center sm:w-auto items-center gap-2 bg-[var(--color-green-700)] text-white px-4 py-2 rounded-md shadow-md hover:bg-[var(--color-green-600)] transition" onClick={() => showRegModal(0)}>
                    <FiPlus /> 상품 등록
                </button>
            </div>

            {/* 상품 리스트 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productList.map((product, index) => (
                <div key={index}
                    onClick={() => setSelectedProduct(product)}
                    className="relative bg-white border border-[var(--color-green-50)] rounded-xl p-5 shadow-md hover:shadow-lg hover:border-[var(--color-green-700)] cursor-pointer transition-all duration-200">
                {/* ✅ 삭제 여부 토글 버튼 (우측 상단 위치) */}
                <div className={`absolute top-3 right-3 text-xs rounded-full px-3 py-1 shadow-sm 
                                ${product.isDeleted ? 'text-gray-600 bg-gray-100 hover:bg-red-100 hover:text-red-600 transition' : 'text-white bg-green-700 hover:bg-green-100 hover:text-black transition'} `} 
                    onClick={(e) => {
                        e.stopPropagation(); // 카드 클릭 이벤트 막기
                        toggleDeleted(product.productId, !product.isDeleted); // 삭제 여부 변경 함수
                    }}>
                    {product.isDeleted ? '비운영' : '운영중'}
                </div>

                <h3 className="font-bold text-[var(--color-green-700)] text-base mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-sm text-gray-600 mt-2">{product.price.toLocaleString()}원 / {product.sessionCnt} 회</p>
                <p className="text-sm text-gray-600 mt-2">신청자 수 : {product.buyUserList.length}명</p>
                </div>
            ))}

            {productList.length === 0 && (
                <p className="text-center text-sm text-gray-400 col-span-full py-10">
                검색된 상품이 없습니다.
                </p>
            )}
            </div>

            {/* 페이징 */}
            {pageData?.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {
                        Array.from({ length: pageData?.totalPages }).map((_, i) => (
                            <button key={i} onClick={() => handleCurrentPage(i + 1)} 
                                className={`w-8 h-8 rounded-full text-sm font-semibold ${pageData?.currentPage == i + 1 
                                    ? 'bg-[var(--color-green-700)] text-white'
                                    : 'bg-white border text-[var(--color-green-700)]'}`}>
                                {i + 1}
                            </button>
                        ))
                    }
                </div>
            )}
        
            {/* 상세 슬라이드 패널 */}
            <AnimatePresence>
                {selectedProduct && (
                    <motion.div className="fixed top-0 right-0 w-full sm:w-[90%] md:w-[500px] h-full bg-white z-50 shadow-2xl p-6 overflow-y-auto border-l border-[var(--color-green-50)]"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        ref={sideDetailLayoutRef}
                        transition={{ type: 'tween', duration: 0.3 }}>
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-bold text-[var(--color-green-700)]">{selectedProduct.name}</h2>
                        <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-black text-2xl">&times;</button>
                    </div>
            
                    <p className="text-sm text-gray-600 mb-1">{selectedProduct.description}</p>
                    <p className="text-sm text-gray-500 mb-4">가격: {selectedProduct.price.toLocaleString()}원</p>
            
                    <div className="flex gap-2 mb-6">
                        <button 
                            className="bg-[var(--color-green-700)] text-white px-4 py-2 rounded hover:bg-[var(--color-green-600)]"
                            onClick={() => showRegModal(selectedProduct.productId)}>수정</button>
                    </div>
            
                    <div>
                        <h3 className="font-semibold text-sm mb-2">구매 신청자 목록</h3>
                        <ul className="space-y-2">
                        {selectedProduct.buyUserList.map((buyUser, idx) => (
                            <li key={idx} className="flex justify-between items-center text-sm bg-[var(--color-green-50)] px-3 py-2 rounded-md">
                            <span>{buyUser.userName}({buyUser.nickName}) 회원님</span>
                            <div className="flex gap-1 text-xs">

                                {
                                    statusCodes.map((code, idx) => (
                                        <span key={idx}
                                            className={`px-2 py-0.5 rounded-full border ${
                                                buyUser.status == code.codeId
                                                ? 'cursor-default bg-[var(--color-green-700)] text-white'
                                                : 'cursor-pointer text-[var(--color-green-700)] border-[var(--color-green-700)] bg-white'}`}
                                            onClick={() => {
                                                if(buyUser.status == code.codeId){
                                                    return;
                                                }else{
                                                    changeBuyStatus(buyUser.userId, buyUser.productId, code.codeId);
                                                } 
                                            }}>
                                            {code.codeName}
                                        </span>
                                    ))
                                }
                            </div>
                            </li>
                        ))}
                        </ul>
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <ToastContainer/>
        </div>
    );
}


export default Products;