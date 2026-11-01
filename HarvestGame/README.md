# Harvest Game (Unity + C#)

لعبة حصاد عشب بسيطة. كل الإعدادات الأساسية في ملف ScriptableObject، والأشكال والأدوات قابلة للتغيير من المحرر.

## الملفات
- `HarvestConfig.cs` : المعاملات الأساسية (السرعة، القطع، النقاط، السعة)
- `HarvestToolData.cs` : بيانات كل أداة (الشكل، نطاق القطع، سرعة الدوران)
- `HarvesterController.cs` : حركة المركبة وتركيب الأدوات
- `HarvestSystem.cs` : نظام قطع العشب
- `Grass.cs` : سلوك العشبة عند القطع
- `HarvestCollector.cs` : النقاط والتفريغ

## الإعداد في Unity
1. أنشئ طبقة (Layer) باسم `Grass` وضعها على مجسمات العشب، ثم اضبط `grassLayer` في `HarvestSystem`.
2. أنشئ تاغ `Dropoff` لمنطقة التفريغ، وفعّل `Is Trigger` في الـ Collider الخاص بها.
3. أضف `HarvesterController` و`HarvestSystem` و`HarvestCollector` إلى كائن المركبة، واجعل `toolMount` كائناً فارغاً أمامها.
4. من قائمة `Create` أنشئ `HarvestConfig` و`HarvestToolData` (لكل أداة ملف).
5. لتغيير شكل المركبة أو الأداة، استبدل المجسم بنموذجك (Blender أو Asset Store) مع الحفاظ على نقطة المحور في المقدمة.

## الرفع إلى GitHub
```bash
git init
git add .
git commit -m "Initial harvest game scripts"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```
