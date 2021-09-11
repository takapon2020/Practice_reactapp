import React, {useCallback, useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import {TextInput, SelectBox, PrimaryButton} from '../components/UIkit/';
import { saveProduct } from '../reducks/products/operations';
import ImageArea from '../components/products/imagearea';
import SetSizeArea from '../components/products/SetSizeArea';
import {db} from '../firebase/index';

const ProductEdit = () => {
  const dispatch = useDispatch();
  let id = window.location.pathname.split('/product/edit')[1];

  if (id !== "") {
    id = id.split('/')[1];
  }

  const [name, setName] = useState(""),
        [description, setDescription] = useState(""),
        [category, setCategory] = useState(""),
        [gender, setGender] = useState(""),
        [images, setImages] = useState([]),
        [price, setPrice] = useState(""),
        [sizes, setSizes] = useState([]);

  const categories = [
    {id: 'tops', name:'トップス'},
    {id: 'shirts', name:'シャツ'},
    {id: 'pants', name:'パンツ'},
    {id: 'shoes', name:'シューズ'},
  ]

  const genders = [
    {id: 'all', name:'全て'},
    {id: 'male', name:'メンズ'},
    {id: 'female', name:'レディース'},
  ]
  
  const inputName = useCallback((event) => {
    setName(event.target.value)
  }, [setName])
  const inputDescription = useCallback((event) => {
    setDescription(event.target.value)
  }, [setDescription])
  const inputPrice = useCallback((event) => {
    setPrice(event.target.value)
  }, [setPrice])

  useEffect(() => {
    if (id !== "") {
      db.collection('products').doc(id).get()
      .then(snapshot => {
        const data = snapshot.data();
        setImages(data.images);
        setName(data.name);
        setDescription(data.description);
        setCategory(data.category);
        setGender(data.gender);
        setPrice(data.price);
      })
    }
  }, [id]);


  return (
    <section>
      <h2 className="u-text__headline u-text-center">商品の登録・編集</h2>
      <div className="c-section-container">
        <ImageArea images={images} setImages={setImages} />
        <TextInput
          fullWidth={true} label={'商品名'} multiline={false} required={true} 
          onChange={inputName} rows={1} value={name} type={"text"}
        />
        <TextInput
          fullWidth={true} label={'商品説明'} multiline={true} required={true} 
          onChange={inputDescription} rows={5} value={description} type={"text"}
        />
        <SelectBox
          label={'カテゴリー'} required={true} 
          select={setCategory} value={category} options={categories}
        />
        <SelectBox
          label={'性別'} required={true} 
          select={setGender} value={gender} options={genders}
        />
        <TextInput
          fullWidth={true} label={'金額'} multiline={false} required={true} 
          onChange={inputPrice} rows={1} value={price} type={"number"}
        />
        <div className="module-spacer--small" />
        <SetSizeArea sizes={sizes} setSizes={setSizes}/>
        <div className="module-spacer--small" />
        <div className="center">
          <PrimaryButton
            label={"商品情報を保存"}
            onClick={() => dispatch(saveProduct(id, name, description, category, gender, price, images))}
          />
        </div>
      </div>

    </section>
  )
}

export default ProductEdit