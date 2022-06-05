import React, { useState, useEffect, useRef } from "react";
import "./_search.scss";
import { Collapse, Button } from "react-bootstrap";
import axios from "axios";
import Breadcrumb from "./../../components/Breadcrumb/index";
import { searchBreadcrumb } from "../../constants/breadcrumData";
import ItemSearch from "../../components/Items/ItemSearch";
import NotFound from "../../components/NotFound";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteParam,
  insertParam,
  changeParamString,
  formatPrice,
  getValueListFilter,
  setLinkDirect,
  getParam,
  getValuePercentFilter,
  scrollInViewDiv,
  scrollToTop,
} from "../../utils/common";
import { searchPostByName } from "../../redux/actions/postActions";
import { useHistory } from "react-router-dom";
import {
  priceStep,
  marksPrice,
  marksGuarantee,
  marksRam,
  ramStep,
  guaranteeStep,
  categoryData,
  videoData,
  displaySizeData,
  cardData,
  apiGetBrandByCategory,
  statusData,
  marksStorage,
  marksStorageData,
  storageTypeData,
  timeData,
} from "../../constants";
import { Box, Slider } from "@material-ui/core";
import AddressSelectSearch from "./../../components/AddressSelectSearch";
import Pagination from "react-js-pagination";

function valuetext(value) {
  return `${value}vnđ`;
}
export default function Search() {
  const [openPrice, setOpenPrice] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [openGuarantee, setOpenGuarantee] = useState(false);
  const [openStorageType, setOpenStorageType] = useState(false);
  const [openStorage, setOpenStorage] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openRam, setOpenRam] = useState(false);
  const [openDisplaySize, setOpenDisplaySize] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openAddress, setOpenAddress] = useState(false);

  //value filter
  const [searchValue, setsearchValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [storageTypeValue, setStorageTypeValue] = useState("");
  const [videoValue, setVideoValue] = useState("");
  const [displaySizeValue, setDisplaySizeValue] = useState("");
  const [cardValue, setCardValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [brandCategoryValue, setBrandCategoryValue] = useState([]);
  const [brandValue, setBrandValue] = useState([]);
  const [addressValue, setAddressValue] = useState("");
  const [sortTimeValue, setSortTimeValue] = useState("");
  const [sortPriceValue, setSortPriceValue] = useState("");

  //useRef
  const categoryRef = useRef(null);

  const history = useHistory();

  const insertParams = (key, value) => {
    let params = insertParam(key, value);
    history.push({
      pathname: "/search",
      search: `?${params}`,
    });
  };

  const showHideCollapse = (type) => {
    switch (type) {
      case "category":
        setOpenCategory(!openCategory);
        break;
      case "price":
        setOpenPrice(!openPrice);
        break;
      case "video":
        setOpenVideo(!openVideo);
        break;
      case "guarantee":
        setOpenGuarantee(!openGuarantee);
        break;
      case "storage_type":
        setOpenStorageType(!openStorageType);
        break;
      case "storage":
        setOpenStorage(!openStorage);
        break;
      case "status":
        setOpenStatus(!openStatus);
        break;
      case "ram":
        setOpenRam(!openRam);
        break;
      case "display_size":
        setOpenDisplaySize(!openDisplaySize);
        break;
      case "card":
        setOpenCard(!openCard);
        break;
      case "brand":
        setOpenBrand(!openBrand);
        break;
      case "address":
        setOpenAddress(!openAddress);
        break;
      default:
        break;
    }
  };
  //get value param and set to ui
  const setValueWhenReload = () => {
    let categoryVal = getParam("category");
    let priceVal = getParam("price");
    let guaranteeVal = getParam("guarantee");
    let storageVal = getParam("storage");
    let videoVal = getParam("video");
    let ramVal = getParam("ram");
    let statusVal = getParam("status");
    let cardVal = getParam("card");
    let brandVal = getParam("brand");
    let storageTypeVal = getParam("storage_type");
    let displaySizeVal = getParam("display");
    let addressVal = getParam("address");
    let sortTimeVal = getParam("create_at");
    let sortPriceVal = getParam("sort");

    if (addressVal) {
      setAddressValue(addressVal);
      setOpenAddress(true);
    }
    if (categoryVal) {
      setCategoryValue(categoryVal);
      setOpenCategory(true);
    }
    if (priceVal) {
      let newValue = priceVal.split("_").map(function (item) {
        return parseInt(item, 10);
      });
      setValueStart(newValue[0]);
      setValueEnd(newValue[1]);
      setValue(
        newValue.map(function (item) {
          return (item / priceStep).toFixed();
        })
      );
      setOpenPrice(true);
    }
    if (guaranteeVal) {
      let newValue = guaranteeVal.split("_").map(function (item) {
        return parseInt(item, 10);
      });
      setValueGuarantee(
        newValue.map(function (item) {
          return (item / guaranteeStep).toFixed();
        })
      );
      setOpenGuarantee(true);
    }
    if (storageVal) {
      let newValue = storageVal.split("_").map(function (item) {
        return parseInt(item, 10);
      });
      setValueStorage(
        newValue.map(function (item) {
          return getValuePercentFilter(marksStorageData, item);
        })
      );
      setValueStorageStart(`${newValue[0]}GB`);
      setValueStorageEnd(`${newValue[1]}GB`);
      setOpenStorage(true);
    }
    if (videoVal) {
      setVideoValue(videoVal);
      setOpenVideo(true);
    }
    if (ramVal) {
      let newValue = ramVal.split("_");
      setValueRam(
        newValue.map(function (item) {
          return getValuePercentFilter(marksRam, item);
        })
      );
      setOpenRam(true);
    }
    if (statusVal) {
      setStatusValue(statusVal);
      setOpenStatus(true);
    }
    if (brandVal && categoryVal !== "3") {
      setBrandValue(brandVal);
      setOpenBrand(true);
    }
    if (cardVal && categoryVal !== "1") {
      setCardValue(cardVal);
      setOpenCard(true);
    }
    if (storageTypeVal && categoryVal !== "1") {
      setStorageTypeValue(storageTypeVal);
      setOpenStorageType(true);
    }
    if (displaySizeVal && categoryVal !== "1") {
      setDisplaySizeValue(displaySizeVal);
      setOpenDisplaySize(true);
    }
    if (sortTimeVal) {
      setSortTimeValue(sortTimeVal);
    }
    if (sortPriceVal) {
      setSortPriceValue(sortPriceVal);
    }
  };

  useEffect(() => {
    setsearchValue(getParam("search"));
  }, [searchValue]);

  const get_post_search = useSelector((state) => state.post.search_result);

  const onChangeCheckSort = (e) => {
    const { id } = e.target;
    if (id === "low-hight") {
      insertParams("sort", "asc");
      setSortPriceValue("asc");
    }
    if (id === "hight-low") {
      insertParams("sort", "desc");
      setSortPriceValue("desc");
    }
  };
  const onChangeCheckSortTime = (e) => {
    const { value } = e.target;
    setSortTimeValue(value);
    if (value == "0") {
      deleteParam("create_at");
    } else {
      insertParams("create_at", timeData[parseInt(value)].type);
    }
  };
  const onChangeCheckCategory = (e) => {
    const { value } = e.target;
    if (value == "0") deleteParam("category");
    else insertParams("category", value);
    console.log("value", value);
    setCategoryValue(value);
  };
  const onChangeCheckVideo = (e) => {
    const { value } = e.target;
    if (value == "-1") deleteParam("video");
    else insertParams("video", value);
    setVideoValue(value);
  };
  const onChangeCheckCard = (e) => {
    const { value } = e.target;
    console.log(value);
    if (value == "-1") deleteParam("card");
    else insertParams("card", value);
    setCardValue(value);
  };
  const onChangeCheckStorageType = (e) => {
    const { value } = e.target;
    let paramVal = changeParamString("storage_type", value);
    if (paramVal != null) {
      insertParams("storage_type", paramVal);
    }
    setStorageTypeValue(paramVal);
  };
  const onChangeDisplaySize = (e) => {
    const { value } = e.target;
    let paramVal = changeParamString("display", value);
    if (paramVal != null) {
      insertParams("display", paramVal);
    }
    setDisplaySizeValue(paramVal);
  };
  const onChangeStatus = (e) => {
    const { value } = e.target;
    let paramVal = changeParamString("status", value);
    if (paramVal != null) {
      insertParams("status", paramVal);
    }
    setStatusValue(paramVal);
  };
  const onChangeBrand = (e) => {
    const { value } = e.target;
    let paramVal = changeParamString("brand", value);
    if (paramVal != null) {
      insertParams("brand", paramVal);
    }
    console.log(paramVal);
    setBrandValue(paramVal);
  };
  const onChangeAddress = (address) => {
    if (address === "") {
      deleteParam("address");
    } else {
      insertParams("address", address);
    }
    setAddressValue(address);
  };

  const scrollRef = useRef(null);
  const scrollInView = () => {
    scrollInViewDiv(scrollRef);
    scrollToTop();
  };

  const dispatch = useDispatch();

  const ApplySearch = () => {
    dispatch(searchPostByName(window.location.search));
  };

  //brand by category
  // const get_brand_category = useSelector((state) => state.brand.brand_category);
  useEffect(() => {
    getBrandByCategory(categoryValue);
    if (categoryValue == "1") {
      deleteParam("storage_type");
      deleteParam("display");
      deleteParam("card");
    } else if (categoryValue == "2") {
    } else if (categoryValue == "3") {
      deleteParam("brand");
      deleteParam("display");
    } else if (categoryValue == "0") {
      deleteParam("storage_type");
      deleteParam("display");
      deleteParam("card");
      deleteParam("brand");
    }
    return () => {};
  }, [categoryValue]);

  const getBrandByCategory = async (id) => {
    if (id == "1" || id == "2")
      try {
        await axios.get(`${apiGetBrandByCategory}/${id}`).then((res) => {
          const brands = res.data.data;
          setBrandCategoryValue(brands);
        });
      } catch (error) {
        return { statusCode: 500, body: error.toString() };
      }
  };

  //slider step price
  const [value, setValue] = useState([0, 0]);
  const [valueStart, setValueStart] = useState(0);
  const [valueEnd, setValueEnd] = useState(0);
  const handleChangePrice = (event, newValue) => {
    setValueStart(newValue[0] * priceStep);
    setValueEnd(newValue[1] * priceStep);
    setValue(newValue);
    console.log("new value", newValue);
    insertParams(
      "price",
      `${newValue[0] * priceStep}_${newValue[1] * priceStep}`
    );
    if (newValue[1] == 0) deleteParam("price");
  };

  //slider step guarantee
  const [valueGuarantee, setValueGuarantee] = useState([0, 0]);
  const handleChangeGuarantee = (event, newValue) => {
    setValueGuarantee(newValue);
    insertParams(
      "guarantee",
      `${newValue[0] * guaranteeStep}_${newValue[1] * guaranteeStep}`
    );
  };

  //slider step ram
  const [valueRam, setValueRam] = useState([0, 0]);
  const handleChangeRam = (event, newValue) => {
    setValueRam(newValue);
    insertParams(
      "ram",
      `${getValueListFilter(marksRam, newValue[0])}_${getValueListFilter(
        marksRam,
        newValue[1]
      )}`
    );
    if (newValue[1] == 0) deleteParam("ram");
  };

  //slider step storage
  const [valueStorage, setValueStorage] = useState([0, 0]);
  const [valueStorageStart, setValueStorageStart] = useState(0);
  const [valueStorageEnd, setValueStorageEnd] = useState(0);
  const handleChangeStorage = (event, newValue) => {
    console.log(newValue);
    setValueStorage(newValue);
    setValueStorageStart(
      `${getValueListFilter(marksStorageData, newValue[0])}GB`
    );
    setValueStorageEnd(
      `${getValueListFilter(marksStorageData, newValue[1])}GB`
    );
    insertParams(
      "storage",
      `${getValueListFilter(
        marksStorageData,
        newValue[0]
      )}_${getValueListFilter(marksStorageData, newValue[1])}`
    );
    if (newValue[1] == 0) deleteParam("storage");
  };

  useEffect(() => {
    setValueWhenReload();
    setLinkDirect();
    dispatch(searchPostByName(window.location.search));
    return () => {
      //clear data
      setsearchValue("");
      setCategoryValue("");
      setStorageTypeValue("");
      setVideoValue("");
      setDisplaySizeValue("");
      setCardValue("");
      setBrandValue([]);
      setValue([0, 0]);
      setValueStart(0);
      setValueEnd(0);
      setValueGuarantee([0, 0]);
      setValueRam([0, 0]);
      setValueStorage([0, 0]);
      setValueStorageStart(0);
      setValueStorageEnd(0);
    };
  }, []);

  return (
    <div className="background-search">
      <div className="container search-container">
        <div id="content">
          <Breadcrumb arrLink={searchBreadcrumb} />
          {/* <button onClick={() => deletePara()}>delete</button> */}
          <div className="d-flex justify-content-end ms-auto pt-0 pb-1 filter-header make-left">
            <div className="form-check filter-header-sort">
              <span>
                <i className="fas fa-funnel-dollar"></i>
                {` Sắp xếp theo`}
              </span>
            </div>
            <div className="form-check filter-header-sort make-left">
              <input
                className="form-check-input mr-5 mt-0"
                type="radio"
                name="sort-low-hight"
                id="low-hight"
                checked={sortPriceValue === "asc"}
                onChange={(e) => onChangeCheckSort(e)}
              />
              <label className="form-check-label" htmlFor="low-hight">
                <i className="fas fa-sort-amount-down-alt"></i>
                {` Giá thấp `}
                <i className="fas fa-long-arrow-alt-right"></i>
                {` cao`}
              </label>
            </div>
            <div className="form-check filter-header-sort make-left">
              <input
                className="form-check-input mr-5 mt-0"
                type="radio"
                name="sort-hight-low"
                id="hight-low"
                checked={sortPriceValue === "desc"}
                onChange={(e) => onChangeCheckSort(e)}
              />
              <label className="form-check-label" htmlFor="hight-low">
                <i className="fas fa-sort-amount-up-alt"></i>
                {` Giá cao `}
                <i className="fas fa-long-arrow-alt-right"></i>
                {` thấp`}
              </label>
            </div>
            <div className="">
              <select
                className="form-select"
                aria-label="Disabled select example"
                id="sort-time"
                name="sort-time"
                onChange={(e) => onChangeCheckSortTime(e)}
                placeholder="Thời gian"
                value={sortTimeValue}
              >
                {timeData.map((data, index) => (
                  <option key={index} value={data.id}>
                    {data.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="d-sm-flex">
            <div className="me-sm-2">
              <div id="filter" className="p-2">
                <div className="border-bottom-custom h5 pb-2 text-uppercase box-label position-relative">
                  <i className="fas fa-sort"></i>
                  {` Bộ lọc`}
                  <div
                    className="position-absolute"
                    style={{ right: 0, top: 0 }}
                  >
                    <button
                      className="btn btn-success p-1"
                      style={{ backgroundColor: "#0abfd2", boder: "none" }}
                      onClick={() => ApplySearch()}
                    >
                      Áp Dụng
                    </button>
                  </div>
                </div>
                <div className="box border-bottom-custom">
                  <div
                    className="box-label text-uppercase d-flex align-items-center"
                    onClick={() => showHideCollapse("category")}
                  >
                    Loại sản phẩm{" "}
                    <button
                      className="btn ms-auto collapse-filter"
                      name="category"
                      onClick={() => showHideCollapse("category")}
                      aria-controls="collpase-category-filter"
                      aria-expanded={openCategory}
                    >
                      {" "}
                      {openCategory ? (
                        <i className="fas fa-minus"></i>
                      ) : (
                        <i className="fas fa-plus"></i>
                      )}{" "}
                    </button>
                  </div>
                  <Collapse in={openCategory}>
                    <div id="collpase-category-filter" ref={categoryRef}>
                      <label className="form-label" htmlFor="post-category">
                        Loại sản phẩm
                      </label>
                      <select
                        className="form-select"
                        aria-label="Disabled select example"
                        required
                        id="post-category"
                        name="category"
                        value={Number(categoryValue)}
                        onChange={(e) => onChangeCheckCategory(e)}
                        placeholder="Loại sản phẩm"
                      >
                        <option value="0">Tất cả</option>
                        {categoryData.map((data, index) => (
                          <option key={index} value={data.id}>
                            {data.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Collapse>
                </div>
                <div className="box border-bottom-custom">
                  <div
                    className="box-label text-uppercase d-flex align-items-center"
                    onClick={() => showHideCollapse("price")}
                  >
                    Giá{" "}
                    <button
                      className="btn ms-auto collapse-filter"
                      name="price"
                      onClick={() => showHideCollapse("price")}
                      aria-controls="collpase-price-filter"
                      aria-expanded={openPrice}
                    >
                      {" "}
                      {openPrice ? (
                        <i className="fas fa-minus"></i>
                      ) : (
                        <i className="fas fa-plus"></i>
                      )}{" "}
                    </button>
                  </div>
                  <Collapse in={openPrice}>
                    <div id="collpase-price-filter">
                      <div className="slider-step-price">
                        <label>Lựa chọn khoảng giá</label>
                        <Box sx={{ width: "100%" }}>
                          <Slider
                            getAriaLabel={() => "Temperature range"}
                            value={value}
                            onChange={handleChangePrice}
                            step={10}
                            marks={marksPrice}
                            getAriaValueText={valuetext}
                          />
                        </Box>
                      </div>
                      <div className="slider-step-value">
                        <input
                          type="text"
                          className="form-control"
                          value={formatPrice(valueStart)}
                          defaultValue="0"
                        />{" "}
                        ~{" "}
                        <input
                          type="text"
                          className="form-control"
                          value={formatPrice(valueEnd)}
                          defaultValue="0"
                        />
                      </div>
                    </div>
                  </Collapse>
                </div>
                <div className="box border-bottom-custom">
                  <div
                    className="box-label text-uppercase d-flex align-items-center"
                    onClick={() => showHideCollapse("address")}
                  >
                    Địa chỉ{" "}
                    <button
                      className="btn ms-auto  collapse-filter"
                      name="address"
                      onClick={() => showHideCollapse("address")}
                      aria-controls="collpase-address-filter"
                      aria-expanded={openAddress}
                    >
                      {" "}
                      {openAddress ? (
                        <i className="fas fa-minus"></i>
                      ) : (
                        <i className="fas fa-plus"></i>
                      )}{" "}
                    </button>
                  </div>
                  <Collapse in={openAddress}>
                    <div id="collpase-address-filter">
                      <AddressSelectSearch
                        addressValue={addressValue}
                        setAddress={onChangeAddress}
                      />
                    </div>
                  </Collapse>
                </div>
                <div className="box border-bottom-custom">
                  <div
                    className="box-label text-uppercase d-flex align-items-center"
                    onClick={() => showHideCollapse("video")}
                  >
                    Video{" "}
                    <button
                      className="btn ms-auto  collapse-filter"
                      name="price"
                      onClick={() => showHideCollapse("video")}
                      aria-controls="collpase-category-filter"
                      aria-expanded={openVideo}
                    >
                      {" "}
                      {openVideo ? (
                        <i className="fas fa-minus"></i>
                      ) : (
                        <i className="fas fa-plus"></i>
                      )}{" "}
                    </button>
                  </div>
                  <Collapse in={openVideo}>
                    <div id="collpase-video-filter">
                      <label htmlFor="rangeVideo">Video chi tiết</label>
                      <select
                        className="form-select"
                        aria-label="Disabled select example"
                        required
                        id="rangeVideo"
                        name="video"
                        value={Number(videoValue)}
                        onChange={(e) => onChangeCheckVideo(e)}
                      >
                        <option value="-1">Tất cả</option>
                        {videoData.map((data, index) => (
                          <option key={index} value={data.id}>
                            {data.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Collapse>
                </div>
                <div className="box border-bottom-custom">
                  <div
                    className="box-label text-uppercase d-flex align-items-center"
                    onClick={() => showHideCollapse("guarantee")}
                  >
                    Bảo hành{" "}
                    <button
                      className="btn ms-auto collapse-filter"
                      name="guarantee"
                      onClick={() => showHideCollapse("guarantee")}
                      aria-controls="collpase-guarantee-filter"
                      aria-expanded={openGuarantee}
                    >
                      {" "}
                      {openGuarantee ? (
                        <i className="fas fa-minus"></i>
                      ) : (
                        <i className="fas fa-plus"></i>
                      )}{" "}
                    </button>
                  </div>
                  <Collapse in={openGuarantee}>
                    <div id="collpase-guarantee-filter">
                      <div className="slider-step-guarantee">
                        <label>Lựa chọn số tháng bảo hành</label>
                        <Box sx={{ width: "100%" }}>
                          <Slider
                            getAriaLabel={() => "Temperature range"}
                            value={valueGuarantee}
                            onChange={handleChangeGuarantee}
                            step={10}
                            marks={marksGuarantee}
                          />
                        </Box>
                      </div>
                    </div>
                  </Collapse>
                </div>
                <div className="box border-bottom-custom">
                  <div
                    className="box-label text-uppercase d-flex align-items-center"
                    onClick={() => showHideCollapse("storage")}
                  >
                    Bộ nhớ{" "}
                    <button
                      className="btn ms-auto collapse-filter"
                      name="storage"
                      onClick={() => showHideCollapse("storage")}
                      aria-controls="collpase-storage-filter"
                      aria-expanded={openStorage}
                    >
                      {" "}
                      {openStorage ? (
                        <i className="fas fa-minus"></i>
                      ) : (
                        <i className="fas fa-plus"></i>
                      )}{" "}
                    </button>
                  </div>
                  <Collapse in={openStorage}>
                    <div id="collpase-storage-filter">
                      <div className="slider-step-storage">
                        <label>Lựa chọn dung lượng</label>
                        <Box sx={{ width: "100%" }}>
                          <Slider
                            getAriaLabel={() => "Temperature range"}
                            value={valueStorage}
                            onChange={handleChangeStorage}
                            step={10}
                            marks={marksStorage}
                            getAriaValueText={valuetext}
                          />
                        </Box>
                      </div>
                      <div className="slider-step-value">
                        <input
                          type="text"
                          className="form-control"
                          value={valueStorageStart}
                          defaultValue="0GB"
                        />{" "}
                        ~{" "}
                        <input
                          type="text"
                          className="form-control"
                          value={valueStorageEnd}
                          defaultValue="0GB"
                        />
                      </div>
                    </div>
                  </Collapse>
                </div>
                <div className="box border-bottom-custom">
                  <div
                    className="box-label text-uppercase d-flex align-items-center"
                    onClick={() => showHideCollapse("status")}
                  >
                    Tình trạng{" "}
                    <button
                      className="btn ms-auto  collapse-filter"
                      name="status"
                      onClick={() => showHideCollapse("status")}
                      aria-controls="collpase-status-filter"
                      aria-expanded={openStatus}
                    >
                      {" "}
                      {openStatus ? (
                        <i className="fas fa-minus"></i>
                      ) : (
                        <i className="fas fa-plus"></i>
                      )}{" "}
                    </button>
                  </div>
                  <Collapse in={openStatus}>
                    <div id="collpase-status-filter">
                      {statusData &&
                        statusData.map((data, index) => (
                          <div className="my-1" key={index}>
                            {" "}
                            <label className="tick">
                              {data.value}
                              <input
                                type="checkbox"
                                value={data.id}
                                onChange={onChangeStatus}
                                checked={
                                  (statusValue?.length &&
                                    statusValue
                                      .split(".")
                                      .map(function (item) {
                                        return parseInt(item, 10);
                                      })
                                      .includes(data.id)) ||
                                  false
                                }
                              />{" "}
                              <span className="check"></span>{" "}
                            </label>{" "}
                          </div>
                        ))}
                    </div>
                  </Collapse>
                </div>
                <div className="box border-bottom-custom">
                  <div
                    className="box-label text-uppercase d-flex align-items-center"
                    onClick={() => showHideCollapse("ram")}
                  >
                    Ram{" "}
                    <button
                      className="btn ms-auto collapse-filter"
                      name="ram"
                      onClick={() => showHideCollapse("ram")}
                      aria-controls="collpase-ram-filter"
                      aria-expanded={openRam}
                    >
                      {" "}
                      {openRam ? (
                        <i className="fas fa-minus"></i>
                      ) : (
                        <i className="fas fa-plus"></i>
                      )}{" "}
                    </button>
                  </div>
                  <Collapse in={openRam}>
                    <div id="collpase-ram-filter">
                      <div className="slider-step-ram">
                        <label htmlFor="rangeRam">
                          Lựa chọn dung lượng ram
                        </label>
                        <Box sx={{ width: "100%" }}>
                          <Slider
                            getAriaLabel={() => "Temperature range"}
                            value={valueRam}
                            onChange={handleChangeRam}
                            step={12.5}
                            marks={marksRam}
                            getAriaValueText={valuetext}
                          />
                        </Box>
                      </div>
                    </div>
                  </Collapse>
                </div>
                {categoryValue == "2" || categoryValue == "3" ? (
                  <div className="box border-bottom-custom">
                    <div
                      className="box-label text-uppercase d-flex align-items-center"
                      onClick={() => showHideCollapse("storage_type")}
                    >
                      Loại ổ cứng{" "}
                      <button
                        className="btn ms-auto  collapse-filter"
                        name="storage-type"
                        onClick={() => showHideCollapse("storage_type")}
                        aria-controls="collpase-storage-type-filter"
                        aria-expanded={openStorageType}
                      >
                        {" "}
                        {openStorageType ? (
                          <i className="fas fa-minus"></i>
                        ) : (
                          <i className="fas fa-plus"></i>
                        )}{" "}
                      </button>
                    </div>
                    <Collapse in={openStorageType}>
                      <div id="collpase-storage-type-filter">
                        {storageTypeData &&
                          storageTypeData.map((data, index) => (
                            <div className="my-1" key={index}>
                              {" "}
                              <label className="tick">
                                {data.value}
                                <input
                                  type="checkbox"
                                  value={data.type}
                                  checked={
                                    (storageTypeValue?.length &&
                                      storageTypeValue
                                        .split(".")
                                        .map(function (item) {
                                          return parseInt(item, 10);
                                        })
                                        .includes(data.id)) ||
                                    false
                                  }
                                  onChange={(e) => onChangeCheckStorageType(e)}
                                />{" "}
                                <span className="check"></span>{" "}
                              </label>{" "}
                            </div>
                          ))}
                      </div>
                    </Collapse>
                  </div>
                ) : null}
                {categoryValue == "1" || categoryValue == "2" ? (
                  <div className="box border-bottom-custom">
                    <div
                      className="box-label text-uppercase d-flex align-items-center"
                      onClick={() => showHideCollapse("brand")}
                    >
                      Hãng{" "}
                      <button
                        className="btn ms-auto collapse-filter"
                        name="brand"
                        onClick={() => showHideCollapse("brand")}
                        aria-controls="collpase-brand-filter"
                        aria-expanded={openBrand}
                      >
                        {" "}
                        {openBrand ? (
                          <i className="fas fa-minus"></i>
                        ) : (
                          <i className="fas fa-plus"></i>
                        )}{" "}
                      </button>
                    </div>
                    <Collapse in={openBrand}>
                      <div id="collpase-brand-filter">
                        {brandCategoryValue &&
                          brandCategoryValue.map((data, index) => (
                            <div className="my-1" key={index}>
                              {" "}
                              <label className="tick">
                                {data.name}{" "}
                                <input
                                  type="checkbox"
                                  value={data.id}
                                  checked={
                                    (brandValue?.length &&
                                      brandValue
                                        .split(".")
                                        .map(function (item) {
                                          return parseInt(item, 10);
                                        })
                                        .includes(data.id)) ||
                                    false
                                  }
                                  onChange={onChangeBrand}
                                />{" "}
                                <span className="check"></span>{" "}
                              </label>{" "}
                            </div>
                          ))}
                      </div>
                    </Collapse>
                  </div>
                ) : null}
                {categoryValue == "2" ? (
                  <div className="box border-bottom-custom">
                    <div className="box-label text-uppercase d-flex align-items-center">
                      Kích thước màn hình{" "}
                      <button
                        className="btn ms-auto collapse-filter"
                        name="display-size"
                        onClick={() => showHideCollapse("display_size")}
                        aria-controls="collpase-display-size-filter"
                        aria-expanded={openDisplaySize}
                      >
                        {" "}
                        {openDisplaySize ? (
                          <i className="fas fa-minus"></i>
                        ) : (
                          <i className="fas fa-plus"></i>
                        )}{" "}
                      </button>
                    </div>
                    <Collapse in={openDisplaySize}>
                      <div id="collpase-display-size-filter">
                        {displaySizeData.map((data, index) => (
                          <div className="my-1" key={index}>
                            {" "}
                            <label className="tick">
                              {data.value}
                              <input
                                type="checkbox"
                                value={data.id}
                                checked={
                                  (displaySizeValue?.length &&
                                    displaySizeValue
                                      .split(".")
                                      .map(function (item) {
                                        return parseInt(item, 10);
                                      })
                                      .includes(data.id)) ||
                                  false
                                }
                                onChange={onChangeDisplaySize}
                              />{" "}
                              <span className="check"></span>{" "}
                            </label>{" "}
                          </div>
                        ))}
                      </div>
                    </Collapse>
                  </div>
                ) : null}
                {categoryValue == "2" || categoryValue == "3" ? (
                  <div className="box border-bottom-custom">
                    <div
                      className="box-label text-uppercase d-flex align-items-center"
                      onClick={() => showHideCollapse("card")}
                    >
                      Card màn hình{" "}
                      <button
                        className="btn ms-auto collapse-filter"
                        name="card"
                        onClick={() => showHideCollapse("card")}
                        aria-controls="collpase-card-filter"
                        aria-expanded={openCard}
                      >
                        {" "}
                        {openCard ? (
                          <i className="fas fa-minus"></i>
                        ) : (
                          <i className="fas fa-plus"></i>
                        )}{" "}
                      </button>
                    </div>
                    <Collapse in={openCard}>
                      <div id="collpase-card-filter">
                        <label htmlFor="range-card">Card đồ họa</label>
                        <select
                          className="form-select"
                          aria-label="Disabled select example"
                          required
                          id="range-card"
                          name="card"
                          value={cardValue}
                          onChange={(e) => onChangeCheckCard(e)}
                        >
                          <option value="-1">Tất cả</option>
                          {cardData.map((data, index) => (
                            <option key={index} value={data.id}>
                              {data.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Collapse>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="row">
              <div
                className="bg-white p-2 col-12"
                id="search-result"
                ref={scrollRef}
              >
                <div className="search-result-status">
                  <div className="search-result-count">
                    {get_post_search?.meta?.total > 0 ? (
                      <p>
                        Có <b>{get_post_search?.meta?.total}</b> sản phẩm phù
                        hợp với tiêu chí của bạn
                      </p>
                    ) : (
                      <p>Không tìm thấy kết quả phù hợp</p>
                    )}
                  </div>
                </div>
                <div>
                  {get_post_search?.meta?.total > 0 ? (
                    <>
                      {get_post_search?.data &&
                        get_post_search?.data.map((data, index) => (
                          <div key={index}>
                            <ItemSearch data={data} />
                          </div>
                        ))}
                    </>
                  ) : (
                    <NotFound />
                  )}
                </div>
              </div>
              {get_post_search?.data?.length && (
                <div className="col-12">
                  <div className="paginate mt-3">
                    <small className="fw-bold d-block">
                      Hiển thị <b>{get_post_search?.data?.length}</b> trên{" "}
                      <b>{get_post_search?.meta?.total}</b> bài viết
                    </small>
                  </div>
                  <div className="mt-1 paginate">
                    <Pagination
                      activePage={get_post_search?.meta?.current_page}
                      itemsCountPerPage={get_post_search?.meta?.per_page}
                      totalItemsCount={get_post_search?.meta?.total || 0}
                      onChange={(pageNumber) => {
                        scrollInView();
                        dispatch(
                          searchPostByName(window.location.search, pageNumber)
                        );
                      }}
                      pageRangeDisplayed={5}
                      itemClass="page-item"
                      linkClass="page-link"
                      firstPageText="Trang đầu"
                      lastPageText="Trang cuối"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
