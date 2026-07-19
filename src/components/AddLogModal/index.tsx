import { useState, useEffect } from 'react';
import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { commonTags } from '@/data/log';
import Tag from '@/components/Tag';
import type { Log } from '@/types';

interface AddLogModalProps {
  visible: boolean;
  mode?: 'add' | 'edit';
  initialData?: Partial<Pick<Log, 'title' | 'content' | 'duration' | 'tags'>>;
  onClose: () => void;
  onSave: (data: { title: string; content: string; duration: number; tags: string[] }) => void;
}

export default function AddLogModal({ visible, mode = 'add', initialData, onClose, onSave }: AddLogModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  useEffect(() => {
    if (!visible) {
      setTitle('');
      setContent('');
      setDuration('');
      setSelectedTags([]);
      setCustomTag('');
      return;
    }

    if (mode === 'edit' && initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
      setDuration(initialData.duration !== undefined ? String(initialData.duration) : '');
      setSelectedTags(initialData.tags || []);
      setCustomTag('');
    } else {
      setTitle('');
      setContent('');
      setDuration('');
      setSelectedTags([]);
      setCustomTag('');
    }
  }, [visible, mode, initialData]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请输入标题', icon: 'none' });
      return;
    }
    const durationNum = parseInt(duration) || 0;
    onSave({
      title: title.trim(),
      content: content.trim(),
      duration: durationNum,
      tags: selectedTags
    });
  };

  if (!visible) return null;

  const modalTitle = mode === 'edit' ? '编辑日志' : '添加日志';
  const saveText = mode === 'edit' ? '保存修改' : '保存';

  return (
    <View className={styles.modalOverlay} onClick={onClose}>
      <View className={styles.modal} onClick={e => e.stopPropagation()}>
        <View className={styles.header}>
          <Text className={styles.title}>{modalTitle}</Text>
          <Text className={styles.close} onClick={onClose}>×</Text>
        </View>
        <View className={styles.content}>
          <View className={styles.formInner}>
            <View className={styles.formItem}>
              <Text className={styles.label}>标题</Text>
              <Input
                className={styles.input}
                placeholder="请输入工作内容标题"
                value={title}
                onInput={e => setTitle(e.detail.value)}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.label}>内容</Text>
              <Textarea
                className={styles.textarea}
                placeholder="请输入详细工作内容..."
                value={content}
                onInput={e => setContent(e.detail.value)}
                autoHeight
                maxlength={500}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.label}>时长（分钟）</Text>
              <Input
                className={styles.input}
                placeholder="请输入工作时长"
                value={duration}
                onInput={e => setDuration(e.detail.value)}
                type="number"
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.label}>标签</Text>
              <View className={styles.tagsContainer}>
                <View className={styles.tagsRow}>
                  {commonTags.map(tag => (
                    <Tag
                      key={tag}
                      active={selectedTags.includes(tag)}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                </View>
              </View>
              <View className={styles.customTag}>
                <Input
                  className={styles.customInput}
                  placeholder="添加自定义标签"
                  value={customTag}
                  onInput={e => setCustomTag(e.detail.value)}
                  onConfirm={addCustomTag}
                />
                <Button className={styles.addBtn} onClick={addCustomTag}>添加</Button>
              </View>
              {selectedTags.length > 0 && (
                <View className={styles.selectedTags}>
                  {selectedTags.map(tag => (
                    <Tag key={tag} active onClick={() => toggleTag(tag)}>
                      {tag} ×
                    </Tag>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
        <View className={styles.footer}>
          <Button className={styles.cancelBtn} onClick={onClose}>取消</Button>
          <Button className={styles.saveBtn} onClick={handleSave}>{saveText}</Button>
        </View>
      </View>
    </View>
  );
}
