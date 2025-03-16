import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useLanguage } from '../contexts/LanguageContext';

function AddWish() {
  const { wishService, isLoading: dbLoading } = useDatabase();
  const { texts } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  // 預設分類選項
  const categories = [
    { id: 'learning', name: texts.categories.learning },
    { id: 'fitness', name: texts.categories.fitness },
    { id: 'travel', name: texts.categories.travel },
    { id: 'career', name: texts.categories.career },
    { id: 'finance', name: texts.categories.finance },
    { id: 'hobby', name: texts.categories.hobby },
    { id: 'other', name: texts.categories.other }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 簡單的表單驗證
    if (!title || !description || !category) {
      alert(texts.addWish.requiredFields);
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // 從 localStorage 獲取當前用戶 ID
      // 在實際應用中，這應該從用戶上下文或身份驗證服務中獲取
      const userId = 1; // 使用示範用戶 ID
      
      // 準備願望數據
      const wishData = {
        userId,
        title,
        description,
        category: categories.find(cat => cat.id === category)?.name || category,
        visibility: isPublic ? 'public' : 'private',
        dueDate: dueDate || null,
        status: 'notStarted',
        priority: 'medium', // 預設優先級
        tags,
      };
      
      // 使用 wishService 儲存願望到 IndexedDB
      const wishId = await wishService.createWish(wishData);
      
      console.log('願望已成功儲存，ID:', wishId);
      
      // 返回首頁
      navigate('/home');
    } catch (error) {
      console.error('儲存願望時出錯:', error);
      alert('儲存願望時出錯，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (dbLoading) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div>載入中...</div>
      </div>
    );
  }

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>{texts.addWish.title}</h2>
        <button className="secondary-btn" onClick={handleCancel}>{texts.addWish.cancel}</button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* 標題 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            {texts.addWish.fields.title.label} <span style={{ color: '#ff3b30' }}>*</span>
          </label>
          <input
            type="text"
            className="input-field"
            placeholder={texts.addWish.fields.title.placeholder}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        {/* 描述 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            {texts.addWish.fields.description.label} <span style={{ color: '#ff3b30' }}>*</span>
          </label>
          <textarea
            className="input-field"
            placeholder={texts.addWish.fields.description.placeholder}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ minHeight: '100px', resize: 'vertical' }}
            required
          ></textarea>
        </div>
        
        {/* 分類 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            {texts.addWish.fields.category.label} <span style={{ color: '#ff3b30' }}>*</span>
          </label>
          <select
            className="input-field"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">{texts.addWish.fields.category.placeholder}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        {/* 標籤 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            {texts.addWish.fields.tags.label}
          </label>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              className="input-field"
              placeholder={texts.addWish.fields.tags.placeholder}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              style={{ flex: 1, marginRight: '8px', marginBottom: 0 }}
            />
            <button 
              type="button" 
              className="secondary-btn"
              onClick={handleAddTag}
            >
              {texts.addWish.fields.tags.add}
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '8px' }}>
            {tags.map((tag, index) => (
              <div key={index} className="tag" style={{ display: 'flex', alignItems: 'center' }}>
                {tag}
                <i 
                  className="fas fa-times" 
                  style={{ marginLeft: '5px', cursor: 'pointer', fontSize: '10px' }}
                  onClick={() => handleRemoveTag(tag)}
                ></i>
              </div>
            ))}
          </div>
        </div>
        
        {/* 截止日期 */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            {texts.addWish.fields.dueDate.label}
          </label>
          <input
            type="date"
            className="input-field"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        
        {/* 公開設定 */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            {texts.addWish.fields.visibility.label}
          </label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              className="toggle-switch" 
              style={{
                width: '50px',
                height: '30px',
                backgroundColor: isPublic ? '#34c759' : '#e0e0e0',
                borderRadius: '15px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                marginRight: '10px'
              }}
              onClick={() => setIsPublic(!isPublic)}
            >
              <div 
                style={{
                  width: '26px',
                  height: '26px',
                  backgroundColor: 'white',
                  borderRadius: '13px',
                  position: 'absolute',
                  top: '2px',
                  left: isPublic ? '22px' : '2px',
                  transition: 'left 0.3s'
                }}
              ></div>
            </div>
            <div>
              {isPublic ? texts.addWish.fields.visibility.public : texts.addWish.fields.visibility.private}
              <div style={{ fontSize: '12px', color: '#8e8e93' }}>
                {isPublic ? texts.addWish.fields.visibility.publicDesc : texts.addWish.fields.visibility.privateDesc}
              </div>
            </div>
          </div>
        </div>
        
        {/* 提交按鈕 */}
        <button 
          type="submit" 
          className="primary-btn" 
          style={{ width: '100%' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? texts.addWish.submitting : texts.addWish.submit}
        </button>
      </form>
    </div>
  );
}

export default AddWish; 